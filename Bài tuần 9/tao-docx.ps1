# Tao file .docx truc tiep (OpenXML) - khong can Word.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = $PSScriptRoot
$docxPath = Join-Path $root 'Bai-tuan-9_Ly-thuyet-va-Thuc-hanh.docx'

# ---------- Ham xu ly ----------
function Dec-Html([string]$s) {
  $s = $s.Replace('&lt;', '<')
  $s = $s.Replace('&gt;', '>')
  $s = $s.Replace('&nbsp;', ' ')
  $s = $s.Replace('&quot;', '"')
  $s = $s.Replace('&amp;', '&')
  return $s
}

function Esc-Xml([string]$s) {
  $s = $s.Replace('&', '&amp;')
  $s = $s.Replace('<', '&lt;')
  $s = $s.Replace('>', '&gt;')
  $s = $s.Replace('"', '&quot;')
  return $s
}

function Get-EscapedFile([string]$filePath) {
  $text = [IO.File]::ReadAllText($filePath, [Text.Encoding]::UTF8)
  $text = $text.Replace('&', '&amp;')
  $text = $text.Replace('<', '&lt;')
  $text = $text.Replace('>', '&gt;')
  return $text
}

# Do mot khoi code thanh cac doan van ban
function Flush-CodeBlock($list, $lines) {
  foreach ($cl in $lines) {
    $list.Add('<w:p><w:pPr><w:pStyle w:val="Code"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas" w:cs="Consolas"/><w:sz w:val="19"/></w:rPr><w:t xml:space="preserve">' + (Esc-Xml (Dec-Html $cl)) + '</w:t></w:r></w:p>')
  }
  $lines.Clear()
}

# Tao XML cac run (van ban co dang <b>...</b>, <i>...</i>)
function New-RunsXml([string]$text, [bool]$boldDefault, [bool]$italicDefault) {
  $plain = Dec-Html $text
  $tokens = [regex]::Split($plain, '(</?b>|</?i>)')
  $bold = $boldDefault
  $italic = $italicDefault
  $xml = ''
  foreach ($t in $tokens) {
    if ($t -eq '<b>') { $bold = $true; continue }
    if ($t -eq '</b>') { $bold = $boldDefault; continue }
    if ($t -eq '<i>') { $italic = $true; continue }
    if ($t -eq '</i>') { $italic = $false; continue }
    if ([string]::IsNullOrEmpty($t)) { continue }
    $rPr = ''
    if ($bold) { $rPr = $rPr + '<w:b/><w:bCs/>' }
    if ($italic) { $rPr = $rPr + '<w:i/><w:iCs/>' }
    $rPrXml = ''
    if ($rPr -ne '') { $rPrXml = '<w:rPr>' + $rPr + '</w:rPr>' }
    $xml = $xml + '<w:r>' + $rPrXml + '<w:t xml:space="preserve">' + (Esc-Xml $t) + '</w:t></w:r>'
  }
  return $xml
}

# ---------- Doc noi dung (giong buoc tao-html.ps1) ----------
$html = [IO.File]::ReadAllText((Join-Path $root 'van-ban\template.html'), [Text.Encoding]::UTF8)
$html = $html.Replace('@@LOGIN@@', (Get-EscapedFile (Join-Path $root 'src\screens\LoginScreen.js')))
$html = $html.Replace('@@APP@@', (Get-EscapedFile (Join-Path $root 'App.js')))
$html = $html.Replace('@@THEME@@', (Get-EscapedFile (Join-Path $root 'src\theme.js')))
$html = $html.Replace('@@PROFILE_CARD@@', (Get-EscapedFile (Join-Path $root 'src\components\ProfileCard.js')))
$html = $html.Replace('@@SETTINGS@@', (Get-EscapedFile (Join-Path $root 'src\components\SettingsList.js')))
$html = $html.Replace('@@PROFILE_SETTINGS@@', (Get-EscapedFile (Join-Path $root 'src\screens\ProfileSettingsScreen.js')))

$bodyStart = $html.IndexOf('<body>') + 6
$bodyEnd = $html.IndexOf('</body>')
$content = $html.Substring($bodyStart, $bodyEnd - $bodyStart)
$lines = [regex]::Split($content, "`r`n|`n|`r")

$bodyXml = New-Object System.Collections.Generic.List[string]
$mode = 'body'
$codeLines = New-Object System.Collections.Generic.List[string]
$rows = New-Object System.Collections.Generic.List[object]
$olCounter = 0
$inOl = $false

foreach ($raw in $lines) {
  $line = $raw.Trim()
  if ($line -eq '') { continue }

  if ($mode -eq 'code') {
    $closeIdx = $line.IndexOf('</pre>')
    if ($closeIdx -ge 0) {
      $before = $line.Substring(0, $closeIdx)
      if ($before.Trim() -ne '') { $codeLines.Add($before) }
      Flush-CodeBlock $bodyXml $codeLines
      $mode = 'body'
      continue
    }
    $codeLines.Add($line)
    continue
  }

  if ($mode -eq 'table') {
    if ($line.StartsWith('</table>')) {
      # Xay the bang
      $tbl = '<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>' +
        '<w:top w:val="single" w:sz="4" w:space="0" w:color="888888"/>' +
        '<w:left w:val="single" w:sz="4" w:space="0" w:color="888888"/>' +
        '<w:bottom w:val="single" w:sz="4" w:space="0" w:color="888888"/>' +
        '<w:right w:val="single" w:sz="4" w:space="0" w:color="888888"/>' +
        '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="888888"/>' +
        '<w:insideV w:val="single" w:sz="4" w:space="0" w:color="888888"/>' +
        '</w:tblBorders></w:tblPr>'
      foreach ($row in $rows) {
        $tbl = $tbl + '<w:tr>'
        foreach ($cell in $row) {
          $shd = ''
          if ($cell.header) { $shd = '<w:shd w:val="clear" w:color="auto" w:fill="EAEAEA"/>' }
          $tbl = $tbl + '<w:tc><w:tcPr>' + $shd + '</w:tcPr><w:p>' + (New-RunsXml $cell.text $cell.header $false) + '</w:p></w:tc>'
        }
        $tbl = $tbl + '</w:tr>'
      }
      $tbl = $tbl + '</w:tbl>'
      $bodyXml.Add($tbl)
      $rows.Clear()
      $mode = 'body'
      continue
    }
    if ($line.StartsWith('<tr')) {
      $row = New-Object System.Collections.Generic.List[object]
      $matches2 = [regex]::Matches($line, '<(t[dh])>(.*?)</t[dh]>')
      foreach ($m in $matches2) {
        $isHeader = ($m.Groups[1].Value -eq 'th')
        $row.Add(@{ text = $m.Groups[2].Value; header = $isHeader })
      }
      $rows.Add($row)
      continue
    }
    continue
  }

  # Che do body
  if ($line.StartsWith('<pre')) {
    $openIdx = $line.IndexOf('>')
    $closeIdx = $line.IndexOf('</pre>')
    $inner = ''
    if ($closeIdx -gt $openIdx) {
      # Mo va dong tren cung mot dong
      $inner = $line.Substring($openIdx + 1, $closeIdX - $openIdx - 1)
    } elseif ($openIdx -ge 0 -and $line.Length -gt ($openIdx + 1)) {
      # Dong mo co van ban cung dong
      $inner = $line.Substring($openIdx + 1)
    }
    if ($inner.Trim() -ne '') { $codeLines.Add($inner) }
    if ($closeIdx -ge 0) {
      Flush-CodeBlock $bodyXml $codeLines
    } else {
      $mode = 'code'
    }
    continue
  }
  if ($line.StartsWith('<table>')) { $mode = 'table'; $rows.Clear(); continue }

  if ($line.StartsWith('<ul>') -or $line.StartsWith('</ul>')) { $inOl = $false; $olCounter = 0; continue }
  if ($line.StartsWith('<ol>')) { $inOl = $true; $olCounter = 0; continue }
  if ($line.StartsWith('</ol>')) { $inOl = $false; continue }

  if ($line.StartsWith('<li>')) {
    $inner = $line
    $inner = $inner -replace '^<li>', '' -replace '</li>$', ''
    if ($inOl) {
      $olCounter++
      $runs = '<w:r><w:t xml:space="preserve">' + (Esc-Xml ($olCounter.ToString() + '. ')) + '</w:t></w:r>' + (New-RunsXml $inner $false $false)
      $bodyXml.Add('<w:p><w:pPr><w:ind w:left="480"/><w:spacing w:after="60"/></w:pPr>' + $runs + '</w:p>')
    } else {
      $runs = '<w:r><w:t xml:space="preserve">&#8226; </w:t></w:r>' + (New-RunsXml $inner $false $false)
      $bodyXml.Add('<w:p><w:pPr><w:ind w:left="480" w:hanging="240"/><w:spacing w:after="60"/></w:pPr>' + $runs + '</w:p>')
    }
    continue
  }

  if ($line.StartsWith('<h1')) {
    $inner = [regex]::Replace($line, '^<h1[^>]*>', '') -replace '</h1>$', ''
    $bodyXml.Add('<w:p><w:pPr><w:pStyle w:val="Title"/></w:pPr>' + (New-RunsXml $inner $true $false) + '</w:p>')
    continue
  }
  if ($line.StartsWith('<h2')) {
    $inner = [regex]::Replace($line, '^<h2[^>]*>', '') -replace '</h2>$', ''
    $bodyXml.Add('<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr>' + (New-RunsXml $inner $true $false) + '</w:p>')
    continue
  }
  if ($line.StartsWith('<h3')) {
    $inner = [regex]::Replace($line, '^<h3[^>]*>', '') -replace '</h3>$', ''
    $bodyXml.Add('<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr>' + (New-RunsXml $inner $true $false) + '</w:p>')
    continue
  }
  if ($line.StartsWith('<p')) {
    $styleId = 'Normal'
    if ($line.StartsWith('<p class="meta"')) { $styleId = 'Meta' }
    if ($line.StartsWith('<p class="note"')) { $styleId = 'Note' }
    $inner = [regex]::Replace($line, '^<p[^>]*>', '') -replace '</p>$', ''
    $bodyXml.Add('<w:p><w:pPr><w:pStyle w:val="' + $styleId + '"/></w:pPr>' + (New-RunsXml $inner $false $false) + '</w:p>')
    continue
  }
}

# ---------- Cac part cua goi docx ----------
$documentXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
'<w:body>' + ([string]::Join('', $bodyXml)) +
'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>' +
'<w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="709" w:footer="709" w:gutter="0"/>' +
'</w:sectPr></w:body></w:document>'

$stylesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
'<w:docDefaults><w:rPrDefault><w:rPr>' +
'<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>' +
'<w:sz w:val="26"/><w:szCs w:val="26"/><w:lang w:val="vi-VN"/></w:rPr></w:rPrDefault>' +
'<w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr></w:pPrDefault></w:docDefaults>' +
'<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>' +
'<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:jc w:val="center"/><w:spacing w:before="120" w:after="240"/></w:pPr><w:rPr><w:b/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style>' +
'<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="360" w:after="160"/><w:jc w:val="left"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr></w:style>' +
'<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="240" w:after="120"/><w:jc w:val="left"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr></w:style>' +
'<w:style w:type="paragraph" w:styleId="Meta"><w:name w:val="Meta"/><w:basedOn w:val="Normal"/><w:pPr><w:jc w:val="center"/><w:spacing w:after="40"/></w:pPr><w:rPr><w:color w:val="444444"/></w:rPr></w:style>' +
'<w:style w:type="paragraph" w:styleId="Note"><w:name w:val="Note"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:before="80" w:after="160"/></w:pPr><w:rPr><w:i/><w:iCs/><w:color w:val="444444"/></w:rPr></w:style>' +
'<w:style w:type="paragraph" w:styleId="Code"><w:name w:val="Code"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="left"/><w:shd w:val="clear" w:color="auto" w:fill="F2F2F2"/><w:ind w:left="100" w:right="100"/></w:pPr><w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas" w:cs="Consolas"/><w:sz w:val="19"/><w:szCs w:val="19"/></w:rPr></w:style>' +
'</w:styles>'

$contentTypesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
'<Default Extension="xml" ContentType="application/xml"/>' +
'<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
'<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
'</Types>'

$relsXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
'</Relationships>'

$docRelsXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
'</Relationships>'

# ---------- Ghi goi zip (docx) ----------
if (Test-Path $docxPath) { Remove-Item $docxPath -Force }
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$zip = [System.IO.Compression.ZipFile]::Open($docxPath, [System.IO.Compression.ZipArchiveMode]::Create)

function Add-ZipEntry($archive, [string]$name, [string]$text) {
  $entry = $archive.CreateEntry($name)
  $stream = $entry.Open()
  $writer = New-Object System.IO.StreamWriter($stream, $utf8NoBom)
  $writer.Write($text)
  $writer.Dispose()
}

Add-ZipEntry $zip '[Content_Types].xml' $contentTypesXml
Add-ZipEntry $zip '_rels/.rels' $relsXml
Add-ZipEntry $zip 'word/document.xml' $documentXml
Add-ZipEntry $zip 'word/styles.xml' $stylesXml
Add-ZipEntry $zip 'word/_rels/document.xml.rels' $docRelsXml
$zip.Dispose()

Get-Item $docxPath | Select-Object FullName, Length

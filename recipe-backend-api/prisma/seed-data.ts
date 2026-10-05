/**
 * Dữ liệu 15 công thức món Việt dùng cho `seed.ts`.
 *
 * Tách riêng khỏi logic seed để file dữ liệu dễ đọc/đổi món mà không đụng code.
 *
 * Quy ước:
 * - `nguyenLieu[].ten` chỉ ghi TÊN, không ghi số lượng. Màn chi tiết tách 2 cột:
 *   trái là tên, phải là `soLuong donVi` đã scale theo khẩu phần người chọn
 *   (`HangNguyenLieu` trong recipe/[id].tsx). Ghi số vào tên sẽ trùng lặp.
 * - `buoc[].anh` là tên file trong `uploads/recipes/`; để trống nếu bước không ảnh.
 */

export interface NguyenLieu {
  ten: string;
  soLuong: number;
  donVi: string;
}

export interface BuocNau {
  noiDung: string;
  anh?: string;
}

export interface MonSeed {
  ten: string;
  moTa: string;
  anh: string;
  thoiGianNau: number;
  thoiGianChuanBi: number;
  khauPhan: number;
  danhMuc: string;
  the: string[];
  nguyenLieu: NguyenLieu[];
  buoc: BuocNau[];
  dinhDuong: { calories: number; protein: number; carbs: number; fat: number };
}

export const anhMon = (tenFile: string) => `/uploads/recipes/${tenFile}`;

/** Pool ảnh thao tác nấu — ghép vào bước cho đúng loại thao tác. */
export const POOL_BUOC = {
  cat: anhMon('buoc-cat.jpg'),
  uop: anhMon('buoc-uop.jpg'),
  xao: anhMon('buoc-xao.jpg'),
  chien: anhMon('buoc-chien.jpg'),
  kho: anhMon('buoc-kho.jpg'),
  ninh: anhMon('buoc-ninh.jpg'),
  nuong: anhMon('buoc-nuong.jpg'),
  toi: anhMon('buoc-toi.jpg'),
  tron: anhMon('buoc-tron.jpg'),
  bay: anhMon('buoc-bay.jpg'),
  rang: anhMon('buoc-rang.jpg'),
  rau: anhMon('buoc-rau.jpg'),
} as const;

export const MON_SEED: MonSeed[] = [
  // -------------------------------------------------------------------------
  {
    ten: 'Phở bò tái gầu',
    moTa:
      'Nước dùng trong ngọt nhờ xương bò hầm 4 giờ cùng quế hồi, thịt tái gầu thái mỏng chan nước sôi sùng sập — món sáng quốc dân của người Hà Nội.',
    anh: anhMon('mon-viet-01.jpg'),
    thoiGianNau: 90,
    thoiGianChuanBi: 40,
    khauPhan: 4,
    danhMuc: 'Bún & Phở',
    the: ['truyền thống', 'đậm đà'],
    nguyenLieu: [
      { ten: 'xương ống bò', soLuong: 1500, donVi: 'g' },
      { ten: 'thịt bò tái gầu', soLuong: 400, donVi: 'g' },
      { ten: 'hành khô', soLuong: 100, donVi: 'g' },
      { ten: 'gừng', soLuong: 80, donVi: 'g' },
      { ten: 'quế', soLuong: 10, donVi: 'g' },
      { ten: 'hồi', soLuong: 5, donVi: 'g' },
      { ten: 'nước mắm', soLuong: 60, donVi: 'ml' },
      { ten: 'đường phèn', soLuong: 30, donVi: 'g' },
      { ten: 'bánh phở', soLuong: 800, donVi: 'g' },
      { ten: 'rau thơm (ngò, kinh giới)', soLuong: 100, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Rửa sạch xương bò, chần sôi 5 phút cùng gừng đập dập rồi đổ nước đi, rửa lại cho hết bọt đen. Bước này quyết định nước dùng có trong hay đục.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Hành khô và gừng nướng trên lửa cho cháy vỏ, rửa sạch rồi đập dập — nước dùng sẽ thơm hơn nhiều so với để sống.',
        anh: POOL_BUOC.toi,
      },
      {
        noiDung:
          'Cho xương vào nồi 4 lít nước, thêm quế, hồi, hạt mùi; hầm lửa nhỏ 3-4 giờ, hớt bọt liên tục. Nước cạn thì thêm nước sôi, không thêm nước lạnh.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Thịt tái gầu thái lát mỏng 2mm, ướp 1 thìa nước mắm và ½ thìa tiêu 15 phút cho thấm.',
        anh: POOL_BUOC.uop,
      },
      {
        noiDung:
          'Nêm nước dùng bằng nước mắm và đường phèn, nếm thấy ngọt hậu nơi cổ họng là đạt. Không dùng bột nêm sẽ làm nước đục.',
      },
      {
        noiDung:
          'Bánh phở chần qua nước sôi 20 giây cho vào tô, xếp thịt tái lên, chan nước dùng đang sôi sùng sập để thịt chín tái ngay tại bàn.',
        anh: POOL_BUOC.bay,
      },
      {
        noiDung: 'Rau thơm, chanh, ớt bày riêng; ăn tới đâu lấy tới đó tránh rau bị nẫu.',
        anh: POOL_BUOC.rau,
      },
    ],
    dinhDuong: { calories: 520, protein: 32, carbs: 62, fat: 18 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Bún chả Hà Nội',
    moTa:
      'Chả viên và thịt ba chỉ nướng trên than hoa, chấm nước mắm chua ngọt đậm vị, ăn kèm bún và rau sống — đặc sản trưa Hà Nội.',
    anh: anhMon('mon-viet-02.jpg'),
    thoiGianNau: 45,
    thoiGianChuanBi: 30,
    khauPhan: 4,
    danhMuc: 'Món chính',
    the: ['truyền thống', 'nhanh gọn'],
    nguyenLieu: [
      { ten: 'thịt ba chỉ', soLuong: 500, donVi: 'g' },
      { ten: 'thịt vai xay', soLuong: 300, donVi: 'g' },
      { ten: 'bún tươi', soLuong: 800, donVi: 'g' },
      { ten: 'nước mắm', soLuong: 80, donVi: 'ml' },
      { ten: 'đường', soLuong: 60, donVi: 'g' },
      { ten: 'tỏi', soLuong: 30, donVi: 'g' },
      { ten: 'hành khô', soLuong: 50, donVi: 'g' },
      { ten: 'giấm', soLuong: 40, donVi: 'ml' },
      { ten: 'rau sống (xà lách, tía tô)', soLuong: 200, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Thịt ba chỉ cắt lát dày 1cm, ướp 3 thìa nước mắm, 2 thìa đường, tỏi băm 15 phút cho thấm.',
        anh: POOL_BUOC.uop,
      },
      {
        noiDung:
          'Thịt vai xay trộn với hành khô băm, nắn thành viên bằng đầu ngón tay — không nén chặt để chả mềm.',
      },
      {
        noiDung:
          'Pha nước chấm: 4 thìa nước mắm + 4 thìa đường + 1 bát nước ấm + 2 thìa giấm, khuấy tan rồi nêm ớt tỏi băm.',
        anh: POOL_BUOC.tron,
      },
      {
        noiDung:
          'Nướng thịt và chả trên than lửa vừa 8-10 phút, trở đều hai mặt cho vàng cháy xém thơm.',
        anh: POOL_BUOC.nuong,
      },
      {
        noiDung:
          'Chia bún vào bát, rưới nước chấm, xếp thịt nướng và chả lên trên, chan thêm 1 thìa mỡ hành phi.',
        anh: POOL_BUOC.bay,
      },
      {
        noiDung: 'Ăn kèm rau sống, thay nước chấm nếu mặn — bún chả ngon nhất khi còn nóng.',
      },
    ],
    dinhDuong: { calories: 610, protein: 30, carbs: 58, fat: 27 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Thịt kho tiêu',
    moTa:
      'Thịt ba chỉ kho lửa nhỏ trong nước dừa đến khi cạn sốt, mỡ trong veo, thịt đỏ cánh gián — món cơm trắng ngày se lạnh.',
    anh: anhMon('mon-viet-03.jpg'),
    thoiGianNau: 70,
    thoiGianChuanBi: 20,
    khauPhan: 4,
    danhMuc: 'Món chính',
    the: ['đậm đà', 'truyền thống'],
    nguyenLieu: [
      { ten: 'thịt ba chỉ', soLuong: 800, donVi: 'g' },
      { ten: 'nước dừa tươi', soLuong: 500, donVi: 'ml' },
      { ten: 'nước mắm', soLuong: 50, donVi: 'ml' },
      { ten: 'đường', soLuong: 40, donVi: 'g' },
      { ten: 'tiêu', soLuong: 8, donVi: 'g' },
      { ten: 'hành tỏi', soLuong: 40, donVi: 'g' },
      { ten: 'nước màu', soLuong: 30, donVi: 'ml' },
      { ten: 'ớt', soLuong: 20, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Thịt ba chỉ cắt vuông 4cm, chần sôi 3 phút với gừng để loại bỏ mùi hôi rồi rửa lại bằng nước lạnh.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Ướp thịt với 3 thìa nước mắm, 2 thìa đường, hành tỏi băm, 1 thìa nước màu, ướp 20 phút.',
        anh: POOL_BUOC.uop,
      },
      {
        noiDung:
          'Phi thơm hành tỏi, cho thịt vào xào săn khoảng 5 phút để thịt săn và ngấm màu.',
        anh: POOL_BUOC.xao,
      },
      {
        noiDung:
          'Đổ nước dừa ngập thịt, thêm ớt và tiêu; đun sôi rồi hạ lửa nhỏ, đậy nắp kho 45-50 phút.',
        anh: POOL_BUOC.kho,
      },
      {
        noiDung:
          'Mở nắp, tăng lửa để cạn sốt sệt lại, thỉnh thoảng lắc nồi chứ không đảo mạnh sẽ làm thịt rã.',
        anh: POOL_BUOC.kho,
      },
      {
        noiDung:
          'Kho tới khi thịt đỏ cánh gián, mỡ trong veo là đạt. Ăn với cơm trắng và dưa leo.',
        anh: POOL_BUOC.bay,
      },
    ],
    dinhDuong: { calories: 680, protein: 34, carbs: 18, fat: 52 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Bò kho cà rốt',
    moTa:
      'Thịt bò hầm mềm thấm đượm quế hồi, cà rốt ngọt, sốt sánh đỏ — ăn kèm bánh mì hoặc hủ tiếu đều ngon.',
    anh: anhMon('mon-viet-04.jpg'),
    thoiGianNau: 120,
    thoiGianChuanBi: 30,
    khauPhan: 4,
    danhMuc: 'Món chính',
    the: ['đậm đà', 'cuối tuần'],
    nguyenLieu: [
      { ten: 'thịt bò gân hoặc ba rọi', soLuong: 1000, donVi: 'g' },
      { ten: 'cà rốt', soLuong: 300, donVi: 'g' },
      { ten: 'nước mắm', soLuong: 50, donVi: 'ml' },
      { ten: 'cà chua', soLuong: 150, donVi: 'g' },
      { ten: 'sả', soLuong: 100, donVi: 'g' },
      { ten: 'quế hồi', soLuong: 12, donVi: 'g' },
      { ten: 'tỏi ớt', soLuong: 40, donVi: 'g' },
      { ten: 'đường', soLuong: 30, donVi: 'g' },
      { ten: 'dầu ăn', soLuong: 40, donVi: 'ml' },
    ],
    buoc: [
      {
        noiDung:
          'Thịt bò cắt khối 4cm, chần sôi 5 phút với sả đập dập rồi rửa sạch — giúp thịt không hôi và nước trong.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Ướp thịt với 3 thìa nước mắm, đường, tỏi băm, quế hồi giã nhỏ, ướp 30 phút.',
        anh: POOL_BUOC.uop,
      },
      {
        noiDung:
          'Phi thơm sả tỏi, thêm cà chua xào nhuyễn tới khi ra dầu đỏ rồi cho thịt vào xào săn.',
        anh: POOL_BUOC.xao,
      },
      {
        noiDung:
          'Đổ nước ngập thịt 5cm, đun sôi rồi hạ lửa nhỏ, hầm 90 phút cho thịt mềm nhưng chưa rã.',
        anh: POOL_BUOC.kho,
      },
      {
        noiDung:
          'Thêm cà rốt cắt khúc, hầm tiếp 15 phút; nêm lại mắm cho vừa ăn. Cà rốt cho muộn để không nát.',
        anh: POOL_BUOC.kho,
      },
      {
        noiDung: 'Múc ra tô, rắc tiêu và rau mùi, ăn kèm bánh mì nóng hoặc bún.',
        anh: POOL_BUOC.bay,
      },
    ],
    dinhDuong: { calories: 590, protein: 42, carbs: 22, fat: 38 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Canh chua cá lóc',
    moTa:
      'Nước canh chua dịu từ me và cà chua, cá lóc trắng ngọt, bạc hà và đậu bắp giòn — món canh đặc trưng của miền Tây.',
    anh: anhMon('mon-viet-05.jpg'),
    thoiGianNau: 40,
    thoiGianChuanBi: 25,
    khauPhan: 4,
    danhMuc: 'Món canh',
    the: ['tươi mát', 'nhanh gọn'],
    nguyenLieu: [
      { ten: 'cá lóc', soLuong: 600, donVi: 'g' },
      { ten: 'cà chua', soLuong: 200, donVi: 'g' },
      { ten: 'đậu bắp', soLuong: 100, donVi: 'g' },
      { ten: 'bạc hà (dọc mùng)', soLuong: 100, donVi: 'g' },
      { ten: 'me', soLuong: 50, donVi: 'g' },
      { ten: 'nước mắm', soLuong: 40, donVi: 'ml' },
      { ten: 'đường', soLuong: 30, donVi: 'g' },
      { ten: 'ngò om, ớt', soLuong: 50, donVi: 'g' },
      { ten: 'thanh cay (kinh giới)', soLuong: 50, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Cá lóc làm sạch, cắt khúc dày 3cm, ướp 2 thìa nước mắm và chút tiêu 15 phút cho thấm.',
        anh: POOL_BUOC.uop,
      },
      {
        noiDung:
          'Bạc hà gọt vỏ, cắt chéo; đậu bắp cắt khúc; cà chua bổ cau — chuẩn bị trước vì canh chua nấu rất nhanh.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Phi thơm hành, thêm cà chua xào nhuyễn rồi đổ 1,2 lít nước, vắt me vào lọc bỏ hạt.',
        anh: POOL_BUOC.xao,
      },
      {
        noiDung:
          'Đun sôi rồi nhẹ tay thả cá vào, không đảo sẽ làm cá gãy; nấu 8-10 phút lửa vừa.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung: 'Thêm đậu bắp và bạc hà, nấu 3 phút nữa rồi nêm mắm, đường, me cho chua ngọt cân.',
      },
      {
        noiDung: 'Tắt bếp mới cho ớt và ngò om — giữ hương thơm. Múc ra tô ăn với cơm.',
        anh: POOL_BUOC.bay,
      },
    ],
    dinhDuong: { calories: 320, protein: 34, carbs: 20, fat: 12 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Bún bò Huế',
    moTa:
      'Nước dùng đỏ ruốc với sả ớt, vị cay nồng đặc trưng, thịt bắp bò mềm và giò heo giòn — bát bún khiến ai xa Huế cũng nhớ.',
    anh: anhMon('mon-viet-06.jpg'),
    thoiGianNau: 100,
    thoiGianChuanBi: 40,
    khauPhan: 4,
    danhMuc: 'Bún & Phở',
    the: ['cay nồng', 'truyền thống'],
    nguyenLieu: [
      { ten: 'xương ống heo', soLuong: 1000, donVi: 'g' },
      { ten: 'thịt bắp bò', soLuong: 500, donVi: 'g' },
      { ten: 'giò heo', soLuong: 400, donVi: 'g' },
      { ten: 'ruốc tôm (mắm ruốc)', soLuong: 60, donVi: 'g' },
      { ten: 'sả', soLuong: 150, donVi: 'g' },
      { ten: 'ớt tươi', soLuong: 50, donVi: 'g' },
      { ten: 'bún bò', soLuong: 800, donVi: 'g' },
      { ten: 'nước mắm', soLuong: 50, donVi: 'ml' },
      { ten: 'rau sống (bắp chuối, rau muống)', soLuong: 200, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Xương heo và giò heo chần sôi 5 phút với sả đập dập, rửa lại cho sạch — nước dùng sẽ trong và hết mùi.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Sả băm nhuyễn, ớt giã nhỏ; ruốc tôm giã mịn rồi trộn với 2 thìa dầu ăn để dậy mùi.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Phi thơm sả, cho ruốc và ớt vào xào 3 phút tới khi đỏ dầu và thơm nồng — đây là linh hồn của bát bún.',
        anh: POOL_BUOC.xao,
      },
      {
        noiDung:
          'Thêm nước vào nồi, thả xương hầm lửa nhỏ 60 phút; vớt bọt liên tục cho nước trong.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Thịt bắp bò luộc chín vừa tới (khoảng 40 phút) rồi vớt ra thái lát mỏng, giò heo để nguyên khúc.',
        anh: POOL_BUOC.kho,
      },
      {
        noiDung:
          'Nêm nước dùng bằng nước mắm và ruốc, nếm cay ngọt đậm; chần bún, xếp thịt và giò lên trên.',
        anh: POOL_BUOC.bay,
      },
      {
        noiDung: 'Ăn kèm bắp chuối bào, rau muống và thêm ớt sa tế nếu thích cay hơn.',
        anh: POOL_BUOC.rau,
      },
    ],
    dinhDuong: { calories: 560, protein: 36, carbs: 60, fat: 20 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Gỏi cuốn tôm thịt',
    moTa:
      'Bánh tráng cuộn tôm, thịt, bún và rau xanh, chấm tương đậu phộng béo ngậy — món khai vị thanh mát quen thuộc.',
    anh: anhMon('mon-viet-07.jpg'),
    thoiGianNau: 30,
    thoiGianChuanBi: 40,
    khauPhan: 4,
    danhMuc: 'Món khai vị',
    the: ['tươi mát', 'nhanh gọn'],
    nguyenLieu: [
      { ten: 'tôm sú', soLuong: 300, donVi: 'g' },
      { ten: 'thịt ba chỉ', soLuong: 250, donVi: 'g' },
      { ten: 'bánh tráng', soLuong: 20, donVi: 'cái' },
      { ten: 'bún tươi', soLuong: 300, donVi: 'g' },
      { ten: 'xà lách, tía tô, rau thơm', soLuong: 200, donVi: 'g' },
      { ten: 'đậu phộng', soLuong: 100, donVi: 'g' },
      { ten: 'tương (tương đen)', soLuong: 60, donVi: 'g' },
      { ten: 'nước mắm, đường', soLuong: 60, donVi: 'ml' },
    ],
    buoc: [
      {
        noiDung:
          'Tôm luộc chín lột vỏ, giữ nguyên con cho đẹp; thịt ba chỉ luộc chín rồi thái lát mỏng.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Rau rửa sạch, để ráo hẳn — bánh tráng bị ướt sẽ rách khi cuộn. Bún chần qua nước sôi rồi cắt khúc.',
        anh: POOL_BUOC.rau,
      },
      {
        noiDung:
          'Pha nước chấm: đường + nước mắm + nước ấm, khuấy tan; đậu phộng rang giã nhỏ trộn vào tương.',
        anh: POOL_BUOC.tron,
      },
      {
        noiDung:
          'Nhúng bánh tráng qua nước 2 giây cho mềm, trải ra; xếp rau, bún, thịt, tôm rồi cuộn chặt tay.',
        anh: POOL_BUOC.bay,
      },
      {
        noiDung:
          'Cuộn gọn hai đầu vào trong như phong bì. Đặt úp đường cuộn xuống để không bung.',
      },
      {
        noiDung: 'Cắt đôi cuộn cho đẹp, chấm tương đậu phộng. Làm tới đâu ăn tới đó.',
        anh: POOL_BUOC.bay,
      },
    ],
    dinhDuong: { calories: 380, protein: 24, carbs: 48, fat: 11 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Bánh mì thịt nướng',
    moTa:
      'Bánh mì giòn rụm kẹp thịt ướp sả tắc nướng than, thêm dưa góp và đồ chua — món ăn vặt quốc dân mọi lứa tuổi.',
    anh: anhMon('mon-viet-08.jpg'),
    thoiGianNau: 35,
    thoiGianChuanBi: 60,
    khauPhan: 4,
    danhMuc: 'Món chính',
    the: ['nhanh gọn', 'đậm đà'],
    nguyenLieu: [
      { ten: 'thịt vai hoặc thịt nạc băm', soLuong: 500, donVi: 'g' },
      { ten: 'bánh mì', soLuong: 8, donVi: 'cái' },
      { ten: 'sả', soLuong: 80, donVi: 'g' },
      { ten: 'tắc (chanh) ', soLuong: 60, donVi: 'g' },
      { ten: 'nước mắm', soLuong: 50, donVi: 'ml' },
      { ten: 'đường', soLuong: 50, donVi: 'g' },
      { ten: 'dưa leo, cà rốt, đồ chua', soLuong: 200, donVi: 'g' },
      { ten: 'tương ớt, mayonnaise', soLuong: 80, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Thịt băm trộn với sả băm nhuyễn, 3 thìa nước mắm, 2 thìa đường, 1 thìa dầu ăn; ướp 45 phút.',
        anh: POOL_BUOC.uop,
      },
      {
        noiDung:
          'Cà rốt, cải thìa bào sợi, ngâm nước đường phèn giấm 30 phút để có món đồ chua giòn.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Nặn thịt thành thanh dẹt, kẹp que tre hoặc trải ra vỉ; nướng trên than lửa vừa 6-8 phút, trở đều hai mặt.',
        anh: POOL_BUOC.nuong,
      },
      {
        noiDung:
          'Bánh mì đem nướng lại cho giòn, dùng kéo cắt dọc một bên — không cắt đứt đôi.',
        anh: POOL_BUOC.chien,
      },
      {
        noiDung:
          'Phết mayonnaise và tương ớt trong bánh, xếp thịt nướng, dưa leo và đồ chua vào.',
        anh: POOL_BUOC.bay,
      },
      {
        noiDung: 'Ăn ngay khi bánh còn nóng giòn, thêm rau răm nếu thích.',
        anh: POOL_BUOC.rau,
      },
    ],
    dinhDuong: { calories: 540, protein: 26, carbs: 58, fat: 22 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Cơm tấm sườn nướng',
    moTa:
      'Hạt cơm tấm tơi bù, sườn non ướp mật ong nướng cháy cạnh, chan mỡ hành và nước mắm pha — bữa trưa no nê của người Sài Gòn.',
    anh: anhMon('mon-viet-09.jpg'),
    thoiGianNau: 50,
    thoiGianChuanBi: 90,
    khauPhan: 4,
    danhMuc: 'Món chính',
    the: ['đậm đà', 'cuối tuần'],
    nguyenLieu: [
      { ten: 'sườn non', soLuong: 1000, donVi: 'g' },
      { ten: 'gạo tấm', soLuong: 400, donVi: 'g' },
      { ten: 'nước mắm', soLuong: 80, donVi: 'ml' },
      { ten: 'mật ong', soLuong: 40, donVi: 'g' },
      { ten: 'tỏi, hành tím', soLuong: 60, donVi: 'g' },
      { ten: 'đường', soLuong: 60, donVi: 'g' },
      { ten: 'hành lá', soLuong: 80, donVi: 'g' },
      { ten: 'dưa góp, đồ chua', soLuong: 150, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Sườn đập nhẹ cho thịt mềm, thái khúc dày 2cm; ướp 4 thìa nước mắm, 3 thìa đường, tỏi hành băm, 2 thìa mật ong, ướp 2 giờ (qua đêm càng ngon).',
        anh: POOL_BUOC.uop,
      },
      {
        noiDung:
          'Vo gạo tấm, ngâm 30 phút rồi nấu như cơm thường; lưu ý nước ít hơn gạo một chút cho hạt tơi.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Nướng sườn trên than lửa vừa 12-15 phút, trở đều và quét nước ướp thừa 2-3 lần để bóng và không khô.',
        anh: POOL_BUOC.nuong,
      },
      {
        noiDung:
          'Hành lá thái nhỏ, đổ mỡ nóng già vào phi thơm để có mỡ hành rưới lên cơm.',
        anh: POOL_BUOC.toi,
      },
      {
        noiDung:
          'Pha nước mắm: 4 thìa nước mắm + 4 thìa đường + 3 thìa nước + 1 thìa giấm, thêm ớt tỏi.',
        anh: POOL_BUOC.tron,
      },
      {
        noiDung:
          'Múc cơm tấm ra đĩa, đặt sườn lên trên, rưới mỡ hành, chan nước mắm và ăn kèm dưa góp.',
        anh: POOL_BUOC.bay,
      },
    ],
    dinhDuong: { calories: 720, protein: 38, carbs: 74, fat: 30 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Chả cá Lã Vọng',
    moTa:
      'Cá lăng ướp nghệ và thì là, chiên vàng rồi xào cùng thì là và hành — món ăn mang tên phố cổ Hà Nội, thơm nức mũi.',
    anh: anhMon('mon-viet-10.jpg'),
    thoiGianNau: 50,
    thoiGianChuanBi: 60,
    khauPhan: 4,
    danhMuc: 'Món chính',
    the: ['truyền thống', 'đậm đà'],
    nguyenLieu: [
      { ten: 'cá lăng (hoặc cá basa)', soLuong: 700, donVi: 'g' },
      { ten: 'thì là', soLuong: 150, donVi: 'g' },
      { ten: 'hành củ', soLuong: 150, donVi: 'g' },
      { ten: 'nghệ', soLuong: 30, donVi: 'g' },
      { ten: 'nước mắm', soLuong: 50, donVi: 'ml' },
      { ten: 'đường', soLuong: 30, donVi: 'g' },
      { ten: 'bún tươi', soLuong: 400, donVi: 'g' },
      { ten: 'mắm tôm', soLuong: 40, donVi: 'g' },
      { ten: 'đậu phộng rang', soLuong: 60, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Cá cắt khối 4cm, ướp 2 thìa nước mắm, 1 thìa đường, nghệ giã, ớt và 1 thìa rượu trắng; ướp 45 phút.',
        anh: POOL_BUOC.uop,
      },
      {
        noiDung:
          'Hành củ tách múi, phi vàng rồi vớt ra; giữ lại dầu thơm để chiên cá.',
        anh: POOL_BUOC.toi,
      },
      {
        noiDung:
          'Cá lăn qua bột áo mỏng, chiên ngập dầu tới khi vàng giòn rồi vớt ra để ráo.',
        anh: POOL_BUOC.chien,
      },
      {
        noiDung:
          'Phi thơm hành, cho cá vào xào nhanh cùng thì là cắt khúc 2-3 phút — không đảo nhiều sẽ nát cá.',
        anh: POOL_BUOC.xao,
      },
      {
        noiDung: 'Pha mắm tôm với đường, chanh, ớt; khuấy đều và nêm cho vừa miệng.',
        anh: POOL_BUOC.tron,
      },
      {
        noiDung:
          'Múc chả cá ra đĩa sâu, rắc đậu phộng và thì là, bày bún và rau thơm xung quanh.',
        anh: POOL_BUOC.bay,
      },
    ],
    dinhDuong: { calories: 520, protein: 36, carbs: 44, fat: 24 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Giò heo hầm măng',
    moTa:
      'Giò heo hầm mềm tan trong miệng cùng măng tươi thấm đượm vị, nước dùng trong — món nhậu và món cơm ngày Tết đều hợp.',
    anh: anhMon('mon-viet-11.jpg'),
    thoiGianNau: 150,
    thoiGianChuanBi: 45,
    khauPhan: 4,
    danhMuc: 'Món chính',
    the: ['cuối tuần', 'đậm đà'],
    nguyenLieu: [
      { ten: 'giò heo trước', soLuong: 1200, donVi: 'g' },
      { ten: 'măng tươi', soLuong: 400, donVi: 'g' },
      { ten: 'nấm hương', soLuong: 80, donVi: 'g' },
      { ten: 'nước mắm', soLuong: 60, donVi: 'ml' },
      { ten: 'hành tím, tỏi', soLuong: 60, donVi: 'g' },
      { ten: 'quế, hồi, lá nguyệt quế', soLuong: 12, donVi: 'g' },
      { ten: 'tiêu, ớt', soLuong: 20, donVi: 'g' },
      { ten: 'gừng', soLuong: 40, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Giò heo chặt khúc, chần sôi 7 phút với gừng đập dập và 1 thìa giấm, rửa lại kỹ — nước hầm sẽ trong và không hôi.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Măng tươi luộc 20 phút với 1 thìa muối rồi vắt ráo, bỏ nước luộc đầu để loại vị đắng.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Ướp giò heo với 3 thìa nước mắm, hành tỏi băm, tiêu ướp 20 phút.',
        anh: POOL_BUOC.uop,
      },
      {
        noiDung:
          'Phi thơm hành tỏi, thêm quế hồi rang thơm rồi cho giò heo vào xào săn 5 phút.',
        anh: POOL_BUOC.xao,
      },
      {
        noiDung:
          'Đổ nước ngập 5cm, hầm lửa nhỏ 100 phút cho giò heo mềm; thỉnh thoảng hớt bọt và châm nước sôi.',
        anh: POOL_BUOC.kho,
      },
      {
        noiDung:
          'Thêm măng và nấm hương, hầm tiếp 20 phút rồi nêm mắm cho đậm; nếm thấy ngọt hậu là đạt.',
        anh: POOL_BUOC.kho,
      },
      {
        noiDung: 'Múc ra tô, rắc tiêu và rau mùi; ăn với bún hoặc cơm nóng.',
        anh: POOL_BUOC.bay,
      },
    ],
    dinhDuong: { calories: 640, protein: 40, carbs: 16, fat: 48 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Nem rán (chả giò)',
    moTa:
      'Vỏ nem mỏng cuộn nhân thịt mộc nhĩ đậu xanh, chiên vàng giòn rụm — món không thể thiếu trong mâm cỗ và bữa sum họp.',
    anh: anhMon('mon-viet-12.jpg'),
    thoiGianNau: 45,
    thoiGianChuanBi: 40,
    khauPhan: 4,
    danhMuc: 'Món khai vị',
    the: ['truyền thống', 'nhanh gọn'],
    nguyenLieu: [
      { ten: 'thịt lợn xay', soLuong: 400, donVi: 'g' },
      { ten: 'bún tàu (miến)', soLuong: 80, donVi: 'g' },
      { ten: 'mộc nhĩ', soLuong: 30, donVi: 'g' },
      { ten: 'đậu xanh', soLuong: 80, donVi: 'g' },
      { ten: 'cà rốt', soLuong: 100, donVi: 'g' },
      { ten: 'hành lá, thì là', soLuong: 80, donVi: 'g' },
      { ten: 'vỏ nem', soLuong: 30, donVi: 'cái' },
      { ten: 'nước mắm, đường, giấm', soLuong: 80, donVi: 'ml' },
      { ten: 'dầu ăn', soLuong: 400, donVi: 'ml' },
    ],
    buoc: [
      {
        noiDung:
          'Miến và mộc nhĩ ngâm nước nóng 15 phút rồi băm nhỏ; đậu xanh ngâm 2 giờ, hấp chín và tán nhuyễn.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Cà rốt bào sợi băm nhỏ, hành lá thì là thái nhỏ — để ráo hết nước, nem ướt sẽ bị bung khi chiên.',
        anh: POOL_BUOC.rau,
      },
      {
        noiDung:
          'Trộn thịt xay với tất cả nhân trên, nêm 2 thìa nước mắm, 1 thìa đường, tiêu; khuấy đều theo một chiều cho dai.',
        anh: POOL_BUOC.tron,
      },
      {
        noiDung:
          'Cuộn nem chắc tay, gấp hai đầu vào trong như gói quà; phết chút nước bột loài ở mép dính.',
        anh: POOL_BUOC.bay,
      },
      {
        noiDung:
          'Chiên ngập dầu lửa vừa 5-7 phút, trở đều tới khi vàng ruộm; chiên lửa to quá nem sẽ cháy ngoài sống trong.',
        anh: POOL_BUOC.chien,
      },
      {
        noiDung:
          'Vớt ra giấy thấm dầu, ăn kèm rau sống, bún và nước chấm chua ngọt pha 3:2:1 (nước mắm:đường:nước).',
        anh: POOL_BUOC.bay,
      },
    ],
    dinhDuong: { calories: 460, protein: 22, carbs: 40, fat: 24 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Xôi gấc',
    moTa:
      'Hạt nếp dẻo đỏ au tự nhiên từ gấc, thơm mùi dừa và đậu xanh — màu đỏ tượng trưng may mắn, thường có trong ngày lễ Tết.',
    anh: anhMon('mon-viet-13.jpg'),
    thoiGianNau: 60,
    thoiGianChuanBi: 180,
    khauPhan: 4,
    danhMuc: 'Món tráng miệng',
    the: ['truyền thống', 'tươi mát'],
    nguyenLieu: [
      { ten: 'nếp', soLuong: 500, donVi: 'g' },
      { ten: 'gấc', soLuong: 300, donVi: 'g' },
      { ten: 'đậu xanh bỏ vỏ', soLuong: 150, donVi: 'g' },
      { ten: 'nước cốt dừa', soLuong: 200, donVi: 'ml' },
      { ten: 'đường', soLuong: 100, donVi: 'g' },
      { ten: 'dừa nạo', soLuong: 80, donVi: 'g' },
      { ten: 'muối', soLuong: 5, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Nếp ngâm 4-6 giờ (hoặc qua đêm) với 1 thìa vôi ăn trầu để hạt nở đều, rồi vo sạch và để ráo.',
        anh: POOL_BUOC.tron,
      },
      {
        noiDung:
          'Gấc múi ra, bỏ hạt; trộn với 1 thìa rượu trắng để màu đỏ đậm và không bị bay màu.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Đậu xanh ngâm 2 giờ, hấp chín rồi tán nhuyễn, trộn nước cốt dừa và ½ lượng đường.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Trộn nếp với múi gấc cho đều tới khi hạt nếp đỏ hồng, ướp 15 phút cho ngấm màu.',
        anh: POOL_BUOC.tron,
      },
      {
        noiDung:
          'Hấp nếp 30 phút, mở ra xới đều một lần rồi hấp thêm 15 phút cho chín đều và tơi.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Nêm phần đường còn lại và 1 nhúm muối, trộn đều; xới ra đĩa, rắc dừa nạo lên trên.',
        anh: POOL_BUOC.bay,
      },
    ],
    dinhDuong: { calories: 430, protein: 9, carbs: 78, fat: 12 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Bánh xèo',
    moTa:
      'Bánh vàng giòn rế, nhân tôm thịt bùng nổ mùi nghệ, cuộn rau sống chấm chua ngọt — nghe tiếng "xèo" là thấy Tết.',
    anh: anhMon('mon-viet-14.jpg'),
    thoiGianNau: 40,
    thoiGianChuanBi: 60,
    khauPhan: 4,
    danhMuc: 'Món chính',
    the: ['nhanh gọn', 'cuối tuần'],
    nguyenLieu: [
      { ten: 'bột bánh xèo (bột gạo)', soLuong: 300, donVi: 'g' },
      { ten: 'tôm sú', soLuong: 300, donVi: 'g' },
      { ten: 'thịt ba chỉ', soLuong: 200, donVi: 'g' },
      { ten: 'nước cốt dừa', soLuong: 200, donVi: 'ml' },
      { ten: 'nghệ', soLuong: 20, donVi: 'g' },
      { ten: 'đậu xanh', soLuong: 80, donVi: 'g' },
      { ten: 'hành lá', soLuong: 80, donVi: 'g' },
      { ten: 'rau sống (xà lách, cải thìa, tía tô)', soLuong: 300, donVi: 'g' },
      { ten: 'nước mắm, đường, chanh', soLuong: 100, donVi: 'ml' },
    ],
    buoc: [
      {
        noiDung:
          'Pha bột với 600ml nước, 200ml nước cốt dừa, 1 thìa nghệ và ½ thìa muối; khuấy tan rồi ủ 60 phút.',
        anh: POOL_BUOC.tron,
      },
      {
        noiDung:
          'Tôm lột vỏ bỏ chỉ, thịt ba chỉ thái mỏng; ướp 1 thìa nước mắm, tiêu 15 phút.',
        anh: POOL_BUOC.uop,
      },
      {
        noiDung:
          'Đậu xanh hấp chín, hành lá thái nhỏ trộn vào bột — đây là phần rế giòn của bánh.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Đun nóng chảo với 1 thìa dầu, cho thịt và tôm xào nhanh 2 phút rồi vớt ra để riêng.',
        anh: POOL_BUOC.xao,
      },
      {
        noiDung:
          'Đổ một vái bột láng mỏng quanh chảo, đậy nắp 2-3 phút; nghe tiếng xèo và mép vàng giòn là chín.',
        anh: POOL_BUOC.chien,
      },
      {
        noiDung:
          'Cho nhân vào giữa, gập đôi bánh, tiếp tục chiên 1 phút cho rế giòn rồi lấy ra.',
        anh: POOL_BUOC.bay,
      },
      {
        noiDung:
          'Pha nước chấm: nước mắm + đường + nước ấm + chanh theo tỉ lệ 2:2:1:1, thêm ớt. Cuộn bánh với rau sống rồi chấm.',
        anh: POOL_BUOC.rau,
      },
    ],
    dinhDuong: { calories: 550, protein: 26, carbs: 62, fat: 22 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Lẩu Thái chua cay',
    moTa:
      'Nước lẩu đỏ au vị sả ớt me chua thanh, tôm mực ngọt, ăn kèm rau tươi và bún — món tụ tập bạn bè những ngày cuối tuần.',
    anh: anhMon('mon-viet-15.jpg'),
    thoiGianNau: 45,
    thoiGianChuanBi: 40,
    khauPhan: 6,
    danhMuc: 'Lẩu & Món nướng',
    the: ['cay nồng', 'cuối tuần'],
    nguyenLieu: [
      { ten: 'tôm sú', soLuong: 400, donVi: 'g' },
      { ten: 'mực', soLuong: 300, donVi: 'g' },
      { ten: 'xương heo', soLuong: 800, donVi: 'g' },
      { ten: 'sả', soLuong: 120, donVi: 'g' },
      { ten: 'me', soLuong: 80, donVi: 'g' },
      { ten: 'bún tươi', soLuong: 500, donVi: 'g' },
      { ten: 'rau lẩu (rau muống, cải, bắp chuối)', soLuong: 400, donVi: 'g' },
      { ten: 'nước mắm, ớt, tỏi', soLuong: 60, donVi: 'g' },
      { ten: 'gia vị lẩu Thái', soLuong: 40, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Xương heo chần sôi 5 phút với sả đập dập, rửa sạch rồi hầm 45 phút lấy nước dùng trong.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Sả băm, tỏi ớt giã nhuyễn; me ngâm nước nóng rồi vắt lấy nước cốt, bỏ xác.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Phi thơm sả tỏi, thêm bột/lượng gia vị lẩu Thái vào xào 2 phút cho dậy mùi và đỏ dầu.',
        anh: POOL_BUOC.xao,
      },
      {
        noiDung:
          'Chan nước dùng vào nồi, thêm nước cốt me, nêm mắm và đường; nếm chua cay ngọt đậm là vừa.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Tôm và mực làm sạch, để riêng — nhúng tới đâu ăn tới đó để hải sản không bị dai.',
        anh: POOL_BUOC.rau,
      },
      {
        noiDung:
          'Bày nồi lẩu giữa bàn kèm rau, bún và đĩa hải sản; ăn sôi sùng sập, thêm sa tế nếu muốn cay hơn.',
        anh: POOL_BUOC.bay,
      },
    ],
    dinhDuong: { calories: 470, protein: 34, carbs: 46, fat: 16 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Bánh cuốn',
    moTa:
      'Lớp bánh gạo mỏng tang cuộn nhân thịt mộc nhĩ, rưới mỡ hành và chấm nước mắm pha — món ăn sáng nhẹ bụng của người Bắc.',
    anh: anhMon('mon-viet-16.jpg'),
    thoiGianNau: 35,
    thoiGianChuanBi: 40,
    khauPhan: 4,
    danhMuc: 'Món khai vị',
    the: ['truyền thống', 'nhanh gọn'],
    nguyenLieu: [
      { ten: 'bột gạo', soLuong: 300, donVi: 'g' },
      { ten: 'bột năng', soLuong: 40, donVi: 'g' },
      { ten: 'thịt lợn băm', soLuong: 250, donVi: 'g' },
      { ten: 'mộc nhĩ khô', soLuong: 15, donVi: 'g' },
      { ten: 'hành khô', soLuong: 40, donVi: 'g' },
      { ten: 'hành lá', soLuong: 60, donVi: 'g' },
      { ten: 'nước mắm', soLuong: 60, donVi: 'ml' },
      { ten: 'đường, dầu ăn', soLuong: 60, donVi: 'g' },
      { ten: 'lạp xưởng (kèm)', soLuong: 120, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Pha bột: bột gạo + bột năng + 1 thìa muối, đổ 600ml nước ấm khuấy tan rồi để nghỉ 30 phút cho bột sánh lại.',
        anh: POOL_BUOC.tron,
      },
      {
        noiDung:
          'Mộc nhĩ ngâm nước nóng 20 phút, bỏ chân rồi thái sợi; hành khô băm nhuyễn, hành lá thái nhỏ riêng phần trắng và xanh.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Phi thơm hành khô, cho thịt băm vào xào chín, thêm mộc nhĩ, 1 thìa nước mắm và ½ thìa tiêu; nêm hơi mặn một chút.',
        anh: POOL_BUOC.xao,
      },
      {
        noiDung:
          'Tráng bánh: quét dầu mỏng lên chảo chống dính, đổ một vá bột dàn mỏng, đậy nắp 40 giây thấy bánh trong là chín.',
        anh: POOL_BUOC.chien,
      },
      {
        noiDung:
          'Lấy bánh ra, cho 1 thìa nhân vào gần mép, cuộn tròn và gập hai đầu vào trong. Làm tới đâu ăn tới đó để bánh không khô.',
        anh: POOL_BUOC.bay,
      },
      {
        noiDung:
          'Mỡ hành: hành lá thái nhỏ tưới dầu nóng già; pha nước chấm đường + nước mắm + chanh theo tỉ lệ 3:2:1, thêm ớt.',
        anh: POOL_BUOC.uop,
      },
    ],
    dinhDuong: { calories: 330, protein: 16, carbs: 52, fat: 8 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Hủ tiếu Nam Vang',
    moTa:
      'Nước dùng trong ngọt từ xương heo ninh cùng tôm khô và mực, sợi hủ tiếu mềm dai, thêm tôm thịt đầy đặn — món ăn chiều phổ biến ở Sài Gòn.',
    anh: anhMon('mon-viet-17.jpg'),
    thoiGianNau: 70,
    thoiGianChuanBi: 40,
    khauPhan: 4,
    danhMuc: 'Bún & Phở',
    the: ['truyền thống', 'đậm đà'],
    nguyenLieu: [
      { ten: 'xương heo', soLuong: 900, donVi: 'g' },
      { ten: 'hủ tiếu khô', soLuong: 400, donVi: 'g' },
      { ten: 'tôm sú', soLuong: 300, donVi: 'g' },
      { ten: 'mực tươi', soLuong: 200, donVi: 'g' },
      { ten: 'thịt băm', soLuong: 150, donVi: 'g' },
      { ten: 'tôm khô', soLuong: 40, donVi: 'g' },
      { ten: 'hành lá, hẹ, cần tây', soLuong: 100, donVi: 'g' },
      { ten: 'nước mắm, đường, tỏi', soLuong: 70, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Xương heo chần sôi 5 phút, rửa sạch rồi hầm lửa nhỏ 45 phút cùng tôm khô; hớt bọt liên tục để nước dùng trong.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Tôm lột vỏ lấy đầu phi thơm lấy dầu màu; thịt băm ướp 1 thìa nước mắm, ½ thìa đường và tỏi băm 15 phút.',
        anh: POOL_BUOC.uop,
      },
      {
        noiDung:
          'Mực làm sạch, cắt khoanh vừa ăn; tôm để nguyên con. Nhúng qua nước sôi 30 giây rồi vớt ra để ráo.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Nêm nước dùng bằng nước mắm và đường, nếm ngọt hậu là đạt; nêm trước khi cho rau tránh nước bị đục.',
        anh: POOL_BUOC.kho,
      },
      {
        noiDung:
          'Hủ tiếu chần qua nước sôi 40 giây cho mềm, vớt ra tô chan nước dùng đang sôi; xếp tôm, mực và thịt băm lên trên.',
        anh: POOL_BUOC.bay,
      },
      {
        noiDung: 'Rắc hành lá, hẹ và tiêu; ăn kèm rau sống, giá và ớt sa tế theo sở thích.',
        anh: POOL_BUOC.rau,
      },
    ],
    dinhDuong: { calories: 540, protein: 30, carbs: 70, fat: 15 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Mì Quảng',
    moTa:
      'Sợi mì vàng dày thấm nước dùng cốt dừa béo, gà ta và tôm rang riềng thơm nồng, ăn kèm bánh tráng giòn và rau sống — đặc sản Quảng Nam.',
    anh: anhMon('mon-viet-18.jpg'),
    thoiGianNau: 60,
    thoiGianChuanBi: 50,
    khauPhan: 4,
    danhMuc: 'Bún & Phở',
    the: ['truyền thống', 'cay nồng'],
    nguyenLieu: [
      { ten: 'mì Quảng', soLuong: 400, donVi: 'g' },
      { ten: 'ức gà', soLuong: 500, donVi: 'g' },
      { ten: 'tôm sú', soLuong: 250, donVi: 'g' },
      { ten: 'nước cốt dừa', soLuong: 200, donVi: 'ml' },
      { ten: 'riềng, sả', soLuong: 60, donVi: 'g' },
      { ten: 'đậu phộng rang', soLuong: 80, donVi: 'g' },
      { ten: 'bắp chuối, rau răm', soLuong: 150, donVi: 'g' },
      { ten: 'nước mắm, ớt bột, bột nghệ', soLuong: 50, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Gà chặt miếng vừa, tôm bỏ vỏ đầu; ướp 2 thìa nước mắm, 1 thìa ớt bột, ½ thìa bột nghệ và riềng sả băm 30 phút.',
        anh: POOL_BUOC.uop,
      },
      {
        noiDung:
          'Phi thơm riềng sả, cho gà vào xào săn thịt 5 phút rồi đổ tôm vào đảo cùng cho tới khi tôm đổi màu.',
        anh: POOL_BUOC.xao,
      },
      {
        noiDung:
          'Chan nước cốt dừa vào nồi, thêm 300ml nước lã, nêm mắm và đường; nấu lửa nhỏ 20 phút cho thấm.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Bắp chuối thái sợi mỏng ngâm nước chanh cho trắng, rau răm nhặt rửa để ráo; đậu phộng rang giã dập.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Mì chần qua nước sôi cho mềm, chia tô; chan nước dùng hơi sệt (ít nước hơn bún phở) và múc gà tôm lên trên.',
        anh: POOL_BUOC.bay,
      },
      {
        noiDung: 'Rắc đậu phộng, bánh tráng nướng giòn; trộn đều rồi ăn với rau sống và ớt tươi.',
        anh: POOL_BUOC.rau,
      },
    ],
    dinhDuong: { calories: 610, protein: 34, carbs: 68, fat: 24 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Bún riêu cua',
    moTa:
      'Nước riêu cua đồng béo bùng bột ớt dầu điều đỏ au, cà chua chua ngọt, thêm đậu hũ và chả giò — món bún quen thuộc mọi hàng quán.',
    anh: anhMon('mon-viet-19.jpg'),
    thoiGianNau: 60,
    thoiGianChuanBi: 50,
    khauPhan: 4,
    danhMuc: 'Bún & Phở',
    the: ['tươi mát', 'cay nồng'],
    nguyenLieu: [
      { ten: 'cua đồng', soLuong: 600, donVi: 'g' },
      { ten: 'bún tươi', soLuong: 500, donVi: 'g' },
      { ten: 'cà chua', soLuong: 350, donVi: 'g' },
      { ten: 'đậu hũ', soLuong: 300, donVi: 'g' },
      { ten: 'me', soLuong: 50, donVi: 'g' },
      { ten: 'dầu điều (dầu annatto)', soLuong: 40, donVi: 'ml' },
      { ten: 'mắm tôm, đường', soLuong: 70, donVi: 'g' },
      { ten: 'hành lá, rau sống', soLuong: 200, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Cua làm sạch, giã lọc lấy nước, gạch để riêng; đánh nước cua với 1 thìa muối rồi bắc lên bếp khuấy đều tới khi riêu nổi lên.',
        anh: POOL_BUOC.tron,
      },
      {
        noiDung:
          'Cà chua bổ cau, đậu hũ cắt miếng; phi thơm hành rồi đổ cà chua vào xào nhuyễn, thêm dầu điều cho nước đỏ đẹp.',
        anh: POOL_BUOC.xao,
      },
      {
        noiDung:
          'Đổ nước dùng vào nồi, thả từng miếng riêu cua vào; thấy riêu kết lại thành tảng là chín, không khuấy vỡ.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Nêm mắm tôm, đường và nước cốt me; nếm chua ngọt đậm vừa miệng rồi cho đậu hũ vào nấu thêm 5 phút.',
        anh: POOL_BUOC.kho,
      },
      {
        noiDung: 'Bún chần qua nước sôi, xếp ra tô; chan nước riêu, gạch cua và cà chua lên trên.',
        anh: POOL_BUOC.bay,
      },
      {
        noiDung: 'Rắc hành lá, ăn kèm rau sống (peria, tía tô, xà lách) và ớt bột nếu thích cay.',
        anh: POOL_BUOC.rau,
      },
    ],
    dinhDuong: { calories: 450, protein: 26, carbs: 58, fat: 14 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Bún đậu mắm tôm',
    moTa:
      'Bún trắng, đậu phụ chiên vàng giòn và thịt luộc chấm mắm tôm pha chanh ớt — combo bình dân nhưng lại gây "nghiện" nhất làng ẩm thực Bắc.',
    anh: anhMon('mon-viet-20.jpg'),
    thoiGianNau: 40,
    thoiGianChuanBi: 30,
    khauPhan: 4,
    danhMuc: 'Món chính',
    the: ['truyền thống', 'đậm đà'],
    nguyenLieu: [
      { ten: 'bún tươi', soLuong: 400, donVi: 'g' },
      { ten: 'đậu phụ', soLuong: 400, donVi: 'g' },
      { ten: 'thịt ba chỉ', soLuong: 300, donVi: 'g' },
      { ten: 'chả cốm', soLuong: 150, donVi: 'g' },
      { ten: 'mắm tôm', soLuong: 80, donVi: 'ml' },
      { ten: 'tỏi, ớt, chanh', soLuong: 80, donVi: 'g' },
      { ten: 'rau sống (perilla, đinh lăng, xà lách)', soLuong: 300, donVi: 'g' },
      { ten: 'đường, dầu ăn', soLuong: 60, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Đậu phụ cắt miếng dày 1cm, thấm khô rồi chiên lửa vừa tới khi vỏ vàng giòn; chiên ướt sẽ bắn dầu.',
        anh: POOL_BUOC.chien,
      },
      {
        noiDung:
          'Thịt ba chỉ luộc chín với ít hành gừng, vớt ra ngâm nước lạnh cho thịt săn rồi thái lát mỏng.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Chả cốm cắt lát, chiên vàng nhanh 2 phút mỗi mặt; rau sống nhặt rửa thật ráo nước.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Pha mắm tôm: 3 thìa mắm tôm + 2 thìa đường + nước cốt chanh, đánh sôi bọt lên rồi thêm tỏi ớt băm.',
        anh: POOL_BUOC.tron,
      },
      {
        noiDung:
          'Bún cắt khúc vừa ăn, xếp cùng đậu, thịt, chả cốm và rau ra đĩa lớn để mọi người tự lấy.',
        anh: POOL_BUOC.bay,
      },
      {
        noiDung: 'Chấm từng miếng đậu và thịt vào mắm tôm, ăn kèm rau thơm cho đỡ ngấy.',
        anh: POOL_BUOC.rau,
      },
    ],
    dinhDuong: { calories: 560, protein: 28, carbs: 60, fat: 24 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Bò lúc lắc',
    moTa:
      'Thịt bò thái khối lắc chảo nóng cùng tỏi, ớt chuông và hành tây, sốt tương đen mặn ngọt — món xào nhanh mà vẫn mềm juicy.',
    anh: anhMon('mon-viet-21.jpg'),
    thoiGianNau: 25,
    thoiGianChuanBi: 40,
    khauPhan: 4,
    danhMuc: 'Món chính',
    the: ['nhanh gọn', 'cuối tuần'],
    nguyenLieu: [
      { ten: 'thịt thăn bò', soLuong: 600, donVi: 'g' },
      { ten: 'hành tây', soLuong: 150, donVi: 'g' },
      { ten: 'ớt chuông', soLuong: 150, donVi: 'g' },
      { ten: 'tỏi', soLuong: 30, donVi: 'g' },
      { ten: 'bơ', soLuong: 40, donVi: 'g' },
      { ten: 'nước tương', soLuong: 60, donVi: 'ml' },
      { ten: 'đường, bột năng', soLuong: 50, donVi: 'g' },
      { ten: 'tiêu, dầu ăn', soLuong: 30, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Bò thái khối vuông 2cm, ướp 1 thìa nước tương, 1 thìa đường, ½ thìa tiêu và 1 thìa bột năng 30 phút cho thấm.',
        anh: POOL_BUOC.uop,
      },
      {
        noiDung:
          'Hành tây và ớt chuông thái miếng vừa ăn; tỏi băm nhỏ. Làm nóng chảo thật kỹ trước khi đổ dầu.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Xào bò trên lửa lớn 2 phút, lắc chảo liên tục cho thịt săn mà không ra nước; vớt ra để riêng.',
        anh: POOL_BUOC.xao,
      },
      {
        noiDung:
          'Cùng chảo đó phi thơm tỏi, cho hành tây và ớt chuông vào xào 2 phút giữ độ giòn.',
        anh: POOL_BUOC.xao,
      },
      {
        noiDung:
          'Cho bò quay lại chảo, đổ hỗn hợp nước tương + đường + 2 thìa nước đun sôi, đảo đều cho sốt sệt bám thịt.',
        anh: POOL_BUOC.kho,
      },
      {
        noiDung: 'Thêm miếng bơ cho bóng, rắc tiêu và ăn ngay với cơm nóng hoặc bánh mì.',
        anh: POOL_BUOC.bay,
      },
    ],
    dinhDuong: { calories: 520, protein: 40, carbs: 34, fat: 27 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Nem nướng',
    moTa:
      'Viên thịt heo quết dai nướng trên than hoa, chấm mắm nướng mặn ngọt, ăn kèm bún và rau sống — món nướng được yêu thích ở Nha Trang.',
    anh: anhMon('mon-viet-22.jpg'),
    thoiGianNau: 30,
    thoiGianChuanBi: 60,
    khauPhan: 4,
    danhMuc: 'Lẩu & Món nướng',
    the: ['cuối tuần', 'đậm đà'],
    nguyenLieu: [
      { ten: 'thịt heo xay', soLuong: 600, donVi: 'g' },
      { ten: 'mỡ heo', soLuong: 50, donVi: 'g' },
      { ten: 'tỏi, hành tím', soLuong: 50, donVi: 'g' },
      { ten: 'đường, nước mắm', soLuong: 80, donVi: 'g' },
      { ten: 'tiêu, bột nêm', soLuong: 20, donVi: 'g' },
      { ten: 'bún tươi, rau sống', soLuong: 400, donVi: 'g' },
      { ten: 'tương ớt, đậu phộng', soLuong: 80, donVi: 'g' },
      { ten: 'que tre (ngâm nước)', soLuong: 30, donVi: 'cái' },
    ],
    buoc: [
      {
        noiDung:
          'Thịt xay cùng mỡ heo cho dai; ướp 2 thìa đường, 1 thìa nước mắm, 1 thìa bột nêm, tỏi hành băm và ½ thìa tiêu.',
        anh: POOL_BUOC.uop,
      },
      {
        noiDung:
          'Quết thịt dẻo khoảng 5 phút cho hỗn hợp dính đều; viên tròn hoặc miếng dẹt dài, ghim que tre.',
        anh: POOL_BUOC.tron,
      },
      {
        noiDung:
          'Nướng trên than lửa vừa 8-10 phút, trở đều và quét thêm nước ướp thừa 2-3 lần để nem không khô.',
        anh: POOL_BUOC.nuong,
      },
      {
        noiDung:
          'Nước chấm: phi thơm hành, thêm 2 thìa đường + 2 thìa nước mắm + 3 thìa nước, khuấy sền sệt rồi bỏ xác hành.',
        anh: POOL_BUOC.kho,
      },
      {
        noiDung: 'Bún cắt khúc, rau sống nhặt rửa; bày nem ra đĩa kèm rau và bún.',
        anh: POOL_BUOC.bay,
      },
      {
        noiDung: 'Lấy nem ra khỏi que, cuộn với bún và rau rồi chấm mắm nướng đang ấm.',
        anh: POOL_BUOC.rau,
      },
    ],
    dinhDuong: { calories: 480, protein: 32, carbs: 44, fat: 22 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Bánh bèo',
    moTa:
      'Đĩa bánh trắng mịn đúc từng chiếc nhỏ, nhân tôm thịt đỏ au rưới mỡ hành rang hẹ — món ăn vặt Huế dân dã mà cuốn hút.',
    anh: anhMon('mon-viet-23.jpg'),
    thoiGianNau: 40,
    thoiGianChuanBi: 40,
    khauPhan: 4,
    danhMuc: 'Món khai vị',
    the: ['truyền thống', 'nhanh gọn'],
    nguyenLieu: [
      { ten: 'bột gạo', soLuong: 250, donVi: 'g' },
      { ten: 'bột năng', soLuong: 60, donVi: 'g' },
      { ten: 'tôm bóc vỏ', soLuong: 200, donVi: 'g' },
      { ten: 'thịt băm', soLuong: 150, donVi: 'g' },
      { ten: 'hành lá', soLuong: 80, donVi: 'g' },
      { ten: 'đậu phộng rang', soLuong: 60, donVi: 'g' },
      { ten: 'nước mắm, đường', soLuong: 70, donVi: 'g' },
      { ten: 'tóp mỡ, dầu ăn', soLuong: 50, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Pha bột: bột gạo + bột năng + 500ml nước lạnh khuấy tan, để yên 20 phút rồi chắt bớt nước trong.',
        anh: POOL_BUOC.tron,
      },
      {
        noiDung:
          'Tôm bóc vỏ băm nhỏ, thịt băm ướp 1 thìa nước mắm và tỏi băm; xào chín tới khi tôm chuyển màu đỏ.',
        anh: POOL_BUOC.xao,
      },
      {
        noiDung:
          'Hành lá thái nhỏ rưới dầu nóng già làm mỡ hành; đậu phộng rang giã dập để riêng.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Đổ bột vào khuôn (hoặc chén nhỏ) đến ¾, hấp cách thủy 4 phút thấy bánh trong và hơi lún là chín.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Múc bánh ra đĩa, cho 1 thìa nhân tôm thịt lên giữa, rưới mỡ hành và tóp mỡ.',
        anh: POOL_BUOC.bay,
      },
      {
        noiDung:
          'Pha nước chấm: 2 thìa nước mắm + 2 thìa đường + 2 thìa nước, chan lên bánh rồi rắc đậu phộng.',
        anh: POOL_BUOC.uop,
      },
    ],
    dinhDuong: { calories: 340, protein: 15, carbs: 54, fat: 9 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Chè bà ba',
    moTa:
      'Hỗn hợp khoai môn, khoai lang, đậu xanh và bột lọc trong vắt nấu với nước cốt dừa béo, thơm mùi lá dứa — món tráng miệng miền Nam.',
    anh: anhMon('mon-viet-24.jpg'),
    thoiGianNau: 50,
    thoiGianChuanBi: 30,
    khauPhan: 6,
    danhMuc: 'Món tráng miệng',
    the: ['truyền thống', 'tươi mát'],
    nguyenLieu: [
      { ten: 'khoai lang', soLuong: 250, donVi: 'g' },
      { ten: 'khoai môn', soLuong: 200, donVi: 'g' },
      { ten: 'đậu xanh đã bỏ vỏ', soLuong: 120, donVi: 'g' },
      { ten: 'bột lọc khô', soLuong: 100, donVi: 'g' },
      { ten: 'nước cốt dừa', soLuong: 300, donVi: 'ml' },
      { ten: 'đường', soLuong: 200, donVi: 'g' },
      { ten: 'lá dứa', soLuong: 20, donVi: 'g' },
      { ten: 'bột năng', soLuong: 30, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Đậu xanh ngâm 2 giờ rồi hấp chín, dầm nhuyễn; lá dứa cột gọn để tạo hương.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Khoai lang và khoai môn gọt vỏ, cắt khối vừa ăn; ngâm nước muối loãng 10 phút cho không thâm rồi rửa lại.',
        anh: POOL_BUOC.cat,
      },
      {
        noiDung:
          'Bột lọc luộc chín trong vắt, vớt ra ngâm nước lạnh để viên bột không dính vào nhau.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Nấu 1 lít nước sôi cùng lá dứa, cho khoai vào nấu lửa vừa 10 phút tới khi khoai chín mềm.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Nêm đường, cho đậu xanh và bột năng pha loãng vào khuấy cho sánh; cuối cùng đổ nước cốt dừa, nấu sôi lăn tăn là tắt bếp.',
        anh: POOL_BUOC.tron,
      },
      {
        noiDung: 'Múc chè ra chén, dọn nóng hoặc ướp lạnh; thêm chút nước cốt dừa tươi lên trên.',
        anh: POOL_BUOC.bay,
      },
    ],
    dinhDuong: { calories: 380, protein: 8, carbs: 76, fat: 9 },
  },

  // -------------------------------------------------------------------------
  {
    ten: 'Cháo lòng',
    moTa:
      'Cháo trắng nấu từ nước dùng ruốc, lòng heo luộc giòn sạch, rắc tiêu hành và ăn kèm quẩy giòn — bữa sáng ấm bụng của người miền Nam.',
    anh: anhMon('mon-viet-25.jpg'),
    thoiGianNau: 70,
    thoiGianChuanBi: 40,
    khauPhan: 4,
    danhMuc: 'Món chính',
    the: ['truyền thống', 'đậm đà'],
    nguyenLieu: [
      { ten: 'gạo tám', soLuong: 250, donVi: 'g' },
      { ten: 'lòng heo (dồi, dạ dày, gan)', soLuong: 600, donVi: 'g' },
      { ten: 'ruốc khô', soLuong: 40, donVi: 'g' },
      { ten: 'gừng, hành tím', soLuong: 60, donVi: 'g' },
      { ten: 'hành lá, rau răm', soLuong: 100, donVi: 'g' },
      { ten: 'tiêu, nước mắm', soLuong: 40, donVi: 'g' },
      { ten: 'quẩy', soLuong: 100, donVi: 'g' },
      { ten: 'tỏi, ớt', soLuong: 40, donVi: 'g' },
    ],
    buoc: [
      {
        noiDung:
          'Lòng heo rửa với chanh và muối cho hết hôi, chần sôi với gừng đập dập rồi luộc chín tới 15 phút, thái miếng vừa.',
        anh: POOL_BUOC.ninh,
      },
      {
        noiDung:
          'Gạo vo sạch, rang sơ với ít dầu cho hạt thơm rồi đổ 1,5 lít nước vào ninh lửa nhỏ 45 phút, thỉnh thoảng khuấy.',
        anh: POOL_BUOC.kho,
      },
      {
        noiDung:
          'Ruốc giã mịn, rang thơm rồi đổ nước vào lọc lấy nước ruốc; chắt phần nước này nấu cháo cho ngọt.',
        anh: POOL_BUOC.rang,
      },
      {
        noiDung:
          'Hành tím phi thơm, gan và dồi cắt lát xào nhanh với 1 thìa nước mắm cho thấm.',
        anh: POOL_BUOC.xao,
      },
      {
        noiDung:
          'Nêm cháo bằng nước mắm và tiêu, cháo sánh mịn là đạt; múc ra tô lớn.',
        anh: POOL_BUOC.bay,
      },
      {
        noiDung:
          'Xếp lòng, dồi, gan lên trên, rắc tiêu nhiều và hành lá; ăn kèm quẩy chấm và rau răm.',
        anh: POOL_BUOC.rau,
      },
    ],
    dinhDuong: { calories: 520, protein: 26, carbs: 62, fat: 20 },
  },
];

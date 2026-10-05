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
];

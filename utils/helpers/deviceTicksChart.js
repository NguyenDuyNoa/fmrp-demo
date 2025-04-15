export const handleTicksBarChart = (value) => {
  //gom value của keHoach và thucHien vao 1 bảng -> tìm giá trị lớn nhất
  const maxValue = Math.max(...value);
  // Làm tròn lên số chia hết cho 4 (tối ưu cho step tròn)
  const roundUpToNearestDivisibleBy4 = (value) => {
    // Làm tròn lên số gần nhất chia hết cho 4
    const remainder = value % 4;
    if (remainder === 0) return value;

    const next = value + (4 - remainder);
    // Nếu next không tròn đẹp (ví dụ 157 + 3 = 160, thì giữ), còn nếu là số xấu thì làm tròn lên bước 10 gần nhất
    const rounded = Math.ceil(next / 10) * 10;
    return rounded % 4 === 0 ? rounded : rounded + (4 - (rounded % 4));
  };
  const newMaxValue = roundUpToNearestDivisibleBy4(maxValue);
  const step = newMaxValue / 4;
  const dynamicTicks = Array.from({ length: 5 }, (_, i) => i * step);

  return dynamicTicks;
};

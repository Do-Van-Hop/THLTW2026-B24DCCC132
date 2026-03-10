import { useState, useEffect } from 'react';
import { message } from 'antd';

export interface KhoiKienThuc {
  id: string;
  ten: string;
}

export interface MonHoc {
  id: string;
  maMon: string;
  tenMon: string;
  soTinChi: number;
}

export interface CauHoi {
  id: string;
  maCauHoi: string;
  monHocId: string;
  noiDung: string;
  mucDo: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
  khoiKienThucId: string;
}

export interface YeuCauCauHoi {
  mucDo: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
  khoiKienThucId?: string;
  soLuong: number;
}

export interface CauTrucDe {
  id: string;
  ten: string;
  monHocId: string;
  yeuCau: YeuCauCauHoi[];
}

export interface DeThi {
  id: string;
  tenDe: string;
  monHocId: string;
  ngayTao: number;
  cauTruc: YeuCauCauHoi[];
  cauHoiIds: string[];
}

const STORAGE_KEY = 'nganhangcauhoi';

export default () => {
  const [khoiKienThuc, setKhoiKienThuc] = useState<KhoiKienThuc[]>([]);
  const [monHoc, setMonHoc] = useState<MonHoc[]>([]);
  const [cauHoi, setCauHoi] = useState<CauHoi[]>([]);
  const [cauTrucDe, setCauTrucDe] = useState<CauTrucDe[]>([]);
  const [deThi, setDeThi] = useState<DeThi[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setKhoiKienThuc(parsed.khoiKienThuc || []);
      setMonHoc(parsed.monHoc || []);
      setCauHoi(parsed.cauHoi || []);
      setCauTrucDe(parsed.cauTrucDe || []);
      setDeThi(parsed.deThi || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ khoiKienThuc, monHoc, cauHoi, cauTrucDe, deThi })
    );
  }, [khoiKienThuc, monHoc, cauHoi, cauTrucDe, deThi]);

  const themKhoiKienThuc = (ten: string) => {
    const tenTrim = ten.trim();
    if (!tenTrim) {
      message.error('Tên khối không được để trống');
      return false;
    }
    if (khoiKienThuc.some((k) => k.ten.toLowerCase() === tenTrim.toLowerCase())) {
      message.warning('Khối kiến thức đã tồn tại');
      return false;
    }
    const newItem: KhoiKienThuc = {
      id: Date.now().toString(),
      ten: tenTrim,
    };
    setKhoiKienThuc((prev) => [...prev, newItem]);
    message.success('Thêm khối kiến thức thành công');
    return true;
  };

  const suaKhoiKienThuc = (id: string, ten: string) => {
    const tenTrim = ten.trim();
    if (!tenTrim) {
      message.error('Tên khối không được để trống');
      return false;
    }
    const isDuplicate = khoiKienThuc.some(
      (k) => k.id !== id && k.ten.toLowerCase() === tenTrim.toLowerCase()
    );
    if (isDuplicate) {
      message.error('Tên khối đã tồn tại');
      return false;
    }
    setKhoiKienThuc((prev) =>
      prev.map((k) => (k.id === id ? { ...k, ten: tenTrim } : k))
    );
    message.success('Cập nhật thành công');
    return true;
  };

  const xoaKhoiKienThuc = (id: string) => {
    if (cauHoi.some((ch) => ch.khoiKienThucId === id)) {
      message.error('Không thể xóa vì có câu hỏi thuộc khối này');
      return false;
    }
    setKhoiKienThuc((prev) => prev.filter((k) => k.id !== id));
    message.success('Xóa thành công');
    return true;
  };

  const themMonHoc = (maMon: string, tenMon: string, soTinChi: number) => {
    const maTrim = maMon.trim().toUpperCase();
    const tenTrim = tenMon.trim();
    if (!maTrim || !tenTrim) {
      message.error('Mã môn và tên môn không được để trống');
      return false;
    }
    if (monHoc.some((m) => m.maMon.toUpperCase() === maTrim)) {
      message.warning('Mã môn đã tồn tại');
      return false;
    }
    const newItem: MonHoc = {
      id: Date.now().toString(),
      maMon: maTrim,
      tenMon: tenTrim,
      soTinChi,
    };
    setMonHoc((prev) => [...prev, newItem]);
    message.success('Thêm môn học thành công');
    return true;
  };

  const suaMonHoc = (
    id: string,
    maMon: string,
    tenMon: string,
    soTinChi: number
  ) => {
    const maTrim = maMon.trim().toUpperCase();
    const tenTrim = tenMon.trim();
    const isDuplicate = monHoc.some(
      (m) => m.id !== id && m.maMon.toUpperCase() === maTrim
    );
    if (isDuplicate) {
      message.error('Mã môn đã tồn tại');
      return false;
    }
    setMonHoc((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, maMon: maTrim, tenMon: tenTrim, soTinChi } : m
      )
    );
    message.success('Cập nhật thành công');
    return true;
  };

  const xoaMonHoc = (id: string) => {
    if (cauHoi.some((ch) => ch.monHocId === id)) {
      message.error('Không thể xóa vì có câu hỏi thuộc môn này');
      return false;
    }
    setMonHoc((prev) => prev.filter((m) => m.id !== id));
    message.success('Xóa thành công');
    return true;
  };

  const themCauHoi = (data: Omit<CauHoi, 'id'>) => {
    if (data.maCauHoi && cauHoi.some((ch) => ch.maCauHoi === data.maCauHoi)) {
      message.error('Mã câu hỏi đã tồn tại');
      return false;
    }
    const newItem: CauHoi = {
      ...data,
      id: Date.now().toString(),
    };
    setCauHoi((prev) => [...prev, newItem]);
    message.success('Thêm câu hỏi thành công');
    return true;
  };

  const suaCauHoi = (id: string, data: Omit<CauHoi, 'id'>) => {
    if (data.maCauHoi && cauHoi.some((ch) => ch.id !== id && ch.maCauHoi === data.maCauHoi)) {
      message.error('Mã câu hỏi đã tồn tại');
      return false;
    }
    setCauHoi((prev) => prev.map((ch) => (ch.id === id ? { ...data, id } : ch)));
    message.success('Cập nhật câu hỏi thành công');
    return true;
  };

  const xoaCauHoi = (id: string) => {
    const used = deThi.some((d) => d.cauHoiIds.includes(id));
    if (used) {
      message.error('Không thể xóa vì câu hỏi đã có trong đề thi');
      return false;
    }
    setCauHoi((prev) => prev.filter((ch) => ch.id !== id));
    message.success('Xóa câu hỏi thành công');
    return true;
  };

  const themCauTrucDe = (ten: string, monHocId: string, yeuCau: YeuCauCauHoi[]) => {
    if (!ten.trim()) {
      message.error('Tên cấu trúc không được để trống');
      return false;
    }
    if (!monHocId) {
      message.error('Vui lòng chọn môn học');
      return false;
    }
    if (!yeuCau.length) {
      message.error('Cần ít nhất một yêu cầu');
      return false;
    }
    for (const y of yeuCau) {
      if (y.soLuong <= 0) {
        message.error('Số lượng phải lớn hơn 0');
        return false;
      }
    }
    const newItem: CauTrucDe = {
      id: Date.now().toString(),
      ten: ten.trim(),
      monHocId,
      yeuCau,
    };
    setCauTrucDe((prev) => [...prev, newItem]);
    message.success('Thêm cấu trúc đề thành công');
    return true;
  };

  const suaCauTrucDe = (id: string, ten: string, monHocId: string, yeuCau: YeuCauCauHoi[]) => {
    if (!ten.trim()) {
      message.error('Tên cấu trúc không được để trống');
      return false;
    }
    if (!monHocId) {
      message.error('Vui lòng chọn môn học');
      return false;
    }
    if (!yeuCau.length) {
      message.error('Cần ít nhất một yêu cầu');
      return false;
    }
    for (const y of yeuCau) {
      if (y.soLuong <= 0) {
        message.error('Số lượng phải lớn hơn 0');
        return false;
      }
    }
    setCauTrucDe((prev) =>
      prev.map((ct) => (ct.id === id ? { ...ct, ten: ten.trim(), monHocId, yeuCau } : ct))
    );
    message.success('Cập nhật cấu trúc đề thành công');
    return true;
  };

  const xoaCauTrucDe = (id: string) => {
    setCauTrucDe((prev) => prev.filter((ct) => ct.id !== id));
    message.success('Xóa cấu trúc đề thành công');
    return true;
  };

  const taoDeThi = (tenDe: string, monHocId: string, yeuCau: YeuCauCauHoi[]): boolean => {
    const cauHoiMon = cauHoi.filter((ch) => ch.monHocId === monHocId);
    if (cauHoiMon.length === 0) {
      message.error('Môn học chưa có câu hỏi nào');
      return false;
    }

    const available = [...cauHoiMon];
    const selectedIds: string[] = [];

    for (const yc of yeuCau) {
      let phuHop = available.filter(
        (ch) =>
          ch.mucDo === yc.mucDo &&
          (!yc.khoiKienThucId || ch.khoiKienThucId === yc.khoiKienThucId)
      );

      if (phuHop.length < yc.soLuong) {
        const khoiTen = yc.khoiKienThucId
          ? khoiKienThuc.find((k) => k.id === yc.khoiKienThucId)?.ten || 'không xác định'
          : 'bất kỳ';
        message.error(
          `Không đủ câu hỏi cho yêu cầu: Mức độ ${yc.mucDo}, Khối ${khoiTen}. Cần ${yc.soLuong}, chỉ có ${phuHop.length}`
        );
        return false;
      }

      const lay = phuHop.slice(0, yc.soLuong);
      lay.forEach((ch) => {
        selectedIds.push(ch.id);
        const index = available.findIndex((a) => a.id === ch.id);
        if (index !== -1) available.splice(index, 1);
      });
    }

    const newDe: DeThi = {
      id: Date.now().toString(),
      tenDe: tenDe.trim(),
      monHocId,
      ngayTao: Date.now(),
      cauTruc: yeuCau,
      cauHoiIds: selectedIds,
    };
    setDeThi((prev) => [...prev, newDe]);
    message.success('Tạo đề thi thành công');
    return true;
  };

  const xoaDeThi = (id: string) => {
    setDeThi((prev) => prev.filter((d) => d.id !== id));
    message.success('Xóa đề thi thành công');
    return true;
  };

  const timKiemCauHoi = (
    monHocId?: string,
    mucDo?: string,
    khoiKienThucId?: string
  ) => {
    return cauHoi.filter((ch) => {
      if (monHocId && ch.monHocId !== monHocId) return false;
      if (mucDo && ch.mucDo !== mucDo) return false;
      if (khoiKienThucId && ch.khoiKienThucId !== khoiKienThucId) return false;
      return true;
    });
  };

  return {
    khoiKienThuc,
    monHoc,
    cauHoi,
    cauTrucDe,
    deThi,

    themKhoiKienThuc,
    suaKhoiKienThuc,
    xoaKhoiKienThuc,

    themMonHoc,
    suaMonHoc,
    xoaMonHoc,

    themCauHoi,
    suaCauHoi,
    xoaCauHoi,

    timKiemCauHoi,

    themCauTrucDe,
    suaCauTrucDe,
    xoaCauTrucDe,

    taoDeThi,
    xoaDeThi,
  };
};
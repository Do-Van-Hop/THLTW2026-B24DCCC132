import { useState, useEffect } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';

export interface FieldConfig {
  id: string;
  key: string;
  label: string;
  type: 'string' | 'number' | 'date';
  required: boolean;
  order: number;
}

export interface SoVanBang {
  id: string;
  nam: number;
  soVaoSo: number;
  quyetDinhIds: string[];
  createdAt: number;
}

export interface QuyetDinh {
  id: string;
  soQD: string;
  ngayBanHanh: string;
  trichYeu: string;
  soVanBangId: string;
  dot: number;
  soVaoSo: number;
  sinhVien: SinhVien[];
  searchCount: number;
}

export interface SinhVien {
  id: string;
  maSV: string;
  hoTen: string;
  ngaySinh: string;
  soVaoSo: number;
  soHieuVanBang: string;
  dynamicFields: Record<string, any>;
}

const STORAGE_KEY = 'vanbang_data';

const defaultFieldConfigs: FieldConfig[] = [
  { id: '1', key: 'danToc', label: 'Dân tộc', type: 'string', required: false, order: 1 },
  { id: '2', key: 'noiSinh', label: 'Nơi sinh', type: 'string', required: false, order: 2 },
  { id: '3', key: 'diemTrungBinh', label: 'Điểm trung bình', type: 'number', required: false, order: 3 },
  { id: '4', key: 'ngayNhapHoc', label: 'Ngày nhập học', type: 'date', required: false, order: 4 },
];

const defaultSoVanBang: SoVanBang[] = [
  { id: '1', nam: 2024, soVaoSo: 5, quyetDinhIds: [], createdAt: Date.now() },
];

const defaultQuyetDinh: QuyetDinh[] = [];

export default () => {
  const [fieldConfigs, setFieldConfigs] = useState<FieldConfig[]>([]);
  const [soVanBang, setSoVanBang] = useState<SoVanBang[]>([]);
  const [quyetDinh, setQuyetDinh] = useState<QuyetDinh[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setFieldConfigs(parsed.fieldConfigs || []);
      setSoVanBang(parsed.soVanBang || []);
      setQuyetDinh(parsed.quyetDinh || []);
    } else {
      setFieldConfigs(defaultFieldConfigs);
      setSoVanBang(defaultSoVanBang);
      setQuyetDinh(defaultQuyetDinh);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fieldConfigs, soVanBang, quyetDinh }));
  }, [fieldConfigs, soVanBang, quyetDinh]);

  const addFieldConfig = (config: Omit<FieldConfig, 'id'>) => {
    const newConfig: FieldConfig = { id: Date.now().toString(), ...config };
    setFieldConfigs(prev => [...prev, newConfig]);
    message.success('Thêm trường thành công');
  };

  const updateFieldConfig = (id: string, data: Partial<Omit<FieldConfig, 'id'>>) => {
    setFieldConfigs(prev => prev.map(f => (f.id === id ? { ...f, ...data } : f)));
    message.success('Cập nhật trường thành công');
  };

  const deleteFieldConfig = (id: string) => {
    setFieldConfigs(prev => prev.filter(f => f.id !== id));
    message.success('Xóa trường thành công');
  };

  const getOrCreateSoVanBang = (nam: number): SoVanBang | undefined => {
    const so = soVanBang.find(s => s.nam === nam);
    if (!so) {
      const newSo: SoVanBang = {
        id: Date.now().toString(),
        nam,
        soVaoSo: 0,
        quyetDinhIds: [],
        createdAt: Date.now(),
      };
      setSoVanBang(prev => [...prev, newSo]);
      return newSo;
    }
    return so;
  };
  const addQuyetDinh = (data: Omit<QuyetDinh, 'id' | 'soVaoSo' | 'sinhVien' | 'searchCount'> & { nam: number }) => {
    const { soQD, ngayBanHanh, trichYeu, soVanBangId, dot, nam } = data;
    let targetSoVanBangId = soVanBangId;
    let soVanBangObj = soVanBang.find(s => s.id === targetSoVanBangId);

    if (!soVanBangObj) {
      if (!nam) {
        message.error('Vui lòng nhập năm tốt nghiệp để tạo sổ mới');
        return null;
      }
      soVanBangObj = getOrCreateSoVanBang(nam);
      if (!soVanBangObj) return null;
      targetSoVanBangId = soVanBangObj.id;
    }

    const soVaoSoMoi = soVanBangObj.soVaoSo + 1;
    const newQuyetDinh: QuyetDinh = {
      id: Date.now().toString(),
      soQD,
      ngayBanHanh,
      trichYeu,
      soVanBangId: targetSoVanBangId,
      dot,
      soVaoSo: soVaoSoMoi,
      sinhVien: [],
      searchCount: 0,
    };

    setQuyetDinh(prev => [...prev, newQuyetDinh]);
    setSoVanBang(prev => prev.map(s =>
      s.id === targetSoVanBangId ? { ...s, soVaoSo: soVaoSoMoi, quyetDinhIds: [...s.quyetDinhIds, newQuyetDinh.id] } : s
    ));
    message.success('Thêm quyết định thành công');
    return newQuyetDinh;
  };

  const deleteQuyetDinh = (id: string) => {
    const qd = quyetDinh.find(q => q.id === id);
    if (!qd) return;
    setSoVanBang(prev => prev.map(s =>
      s.id === qd.soVanBangId ? { ...s, quyetDinhIds: s.quyetDinhIds.filter(qid => qid !== id) } : s
    ));
    setQuyetDinh(prev => prev.filter(q => q.id !== id));
    message.success('Xóa quyết định thành công');
  };

  const addSinhVien = (quyetDinhId: string, svData: Omit<SinhVien, 'id' | 'soVaoSo' | 'soHieuVanBang'>) => {
    const qd = quyetDinh.find(q => q.id === quyetDinhId);
    if (!qd) {
      message.error('Quyết định không tồn tại');
      return false;
    }

    const soHieu = `VB/${qd.soVaoSo}/${qd.sinhVien.length + 1}`;

    const newSinhVien: SinhVien = {
      id: Date.now().toString(),
      ...svData,
      soVaoSo: qd.soVaoSo,
      soHieuVanBang: soHieu,
    };

    setQuyetDinh(prev => prev.map(q =>
      q.id === quyetDinhId ? { ...q, sinhVien: [...q.sinhVien, newSinhVien] } : q
    ));
    message.success('Thêm sinh viên thành công');
    return true;
  };

  const removeSinhVien = (quyetDinhId: string, sinhVienId: string) => {
    setQuyetDinh(prev => prev.map(q =>
      q.id === quyetDinhId ? { ...q, sinhVien: q.sinhVien.filter(sv => sv.id !== sinhVienId) } : q
    ));
    message.success('Đã thu hồi văn bằng');
  };

  const traCuuVanBang = (criteria: { soHieu?: string; soVaoSo?: number; maSV?: string; hoTen?: string; ngaySinh?: string }) => {
    const { soHieu, soVaoSo, maSV, hoTen, ngaySinh } = criteria;
    const filled = [soHieu, soVaoSo, maSV, hoTen, ngaySinh].filter(v => v !== undefined && v !== '' && (typeof v !== 'number' || !isNaN(v))).length;
    if (filled < 2) {
      message.warning('Vui lòng nhập ít nhất 2 tham số để tra cứu');
      return [];
    }

    const results: { quyetDinh: QuyetDinh; sinhVien: SinhVien }[] = [];

    quyetDinh.forEach(qd => {
      qd.sinhVien.forEach(sv => {
        let match = true;
        if (soHieu && !sv.soHieuVanBang.includes(soHieu)) match = false;
        if (soVaoSo !== undefined && sv.soVaoSo !== soVaoSo) match = false;
        if (maSV && sv.maSV !== maSV) match = false;
        if (hoTen && !sv.hoTen.toLowerCase().includes(hoTen.toLowerCase())) match = false;
        if (ngaySinh && sv.ngaySinh !== ngaySinh) match = false;

        if (match) {
          results.push({ quyetDinh: qd, sinhVien: sv });
        }
      });
    });

    const affectedQdIds = [...new Set(results.map(r => r.quyetDinh.id))];
    if (affectedQdIds.length > 0) {
      setQuyetDinh(prev => prev.map(qd =>
        affectedQdIds.includes(qd.id) ? { ...qd, searchCount: qd.searchCount + 1 } : qd
      ));
    }

    return results;
  };

  return {
    fieldConfigs,
    soVanBang,
    quyetDinh,
    addFieldConfig,
    updateFieldConfig,
    deleteFieldConfig,
    getOrCreateSoVanBang,
    addQuyetDinh,
    deleteQuyetDinh,
    addSinhVien,
    removeSinhVien,
    traCuuVanBang,
  };
};
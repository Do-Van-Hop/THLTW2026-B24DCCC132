export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},
	// {
	// 	path: '/quan-ly-san-pham',
	// 	name: 'Quản lý sản phẩm',
	// 	icon: 'shopping',
	// 	component: './QuanLySanPham',
	// },
	// {
	// 	path: '/quan-ly-don-hang',
	// 	name: 'Quản lý đơn hàng',
	// 	icon: 'shoppingCart',
	// 	component: './QuanLyDonHang',
	// },
	// {
	// 	path: '/thong-ke',
	// 	name: 'Thống kê',
	// 	icon: 'barChart',
	// 	component: './ThongKe',
	// },

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	// {
	// 	path: '/todo-list',
	// 	name: 'TodoList',
	// 	icon: 'OrderedListOutlined',
	// 	component: './TodoList',
	// },
	{
		path: '/doan-so',
		name: 'Bài 1',
		icon: 'NumberOutlined',
		component: './DoanSo',
	},
	{
		path: '/hoc-tap',
		name: 'Bài 2',
		icon: 'book',
		component: './HocTap',
	},
	{
		path: '/oan-tu-ti',
		name: 'Oẳn Tù Tì',
		icon: 'rocket', 
		component: './OanTuTi',
	},
	{
		path: '/ngan-hang-cau-hoi',
		name: 'Ngân hàng câu hỏi',
		icon: 'database',
		component: './NganHangCauHoi',
	},
	{
		path: '/dat-lich',
		name: 'Đặt lịch hẹn',
		icon: 'calendar',
		component: './DatLich',
	},
	{
		path: '/van-bang',
		name: 'Quản lý văn bằng',
		icon: 'book',
		component: './VanBang',
	},
	{
		path: '/clb',
		name: 'Câu lạc bộ',
		icon: 'team',
		component: './Clb',
	},
	{
		path: '/travel-planner',
		name: 'Lập kế hoạch du lịch',
		icon: 'compass',
		component: './TravelPlanner',
	},
	{
		path: '/course-management',
		name: 'Quản lý khóa học',
		icon: 'book',
		component: './CourseManagement',
	},
	{
		path: '/blog',
		name: 'Blog',
		icon: 'read',
		routes: [
			{ path: '/blog', redirect: '/blog/home' },
			{ path: '/blog/home', name: 'Trang chủ', component: './Blog/index' },
			{ path: '/blog/post/:slug', component: './Blog/PostDetail' },
			{ path: '/blog/about', name: 'Giới thiệu', component: './Blog/About' },
			{ path: '/blog/admin', name: 'Quản trị', component: './Blog/Admin' },
		],
	},
	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];

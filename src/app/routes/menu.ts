
const Home = {
    text: 'Home',
    link: '/home'+`/${localStorage.getItem("token")}`,
    icon: 'icon-home'
};

const Dashboard = {
    text: 'Dashboard',
    link: '/dashboard'+`/${localStorage.getItem("token")}`,
    icon: 'icon-speedometer'
};

const Createpoll = {
    text: 'Create Poll',
    link: '/createpoll'+`/${localStorage.getItem("token")}`,
    icon: 'icon-grid'
};

const Reportpoll = {
    text: 'Report Poll',
    link: '/reportpoll'+`/${localStorage.getItem("token")}`,
    icon: 'icon-chemistry',
};

const Invite = {
    text: 'Invite',
    link: '/invite'+`/${localStorage.getItem("token")}`,
    icon: 'icon-note'    
};

const Logout = {
    text: 'Logout',
    link: '/login',
    icon: 'icon-logout'   
};


const headingMain = {
    text: 'Main',
    heading: true
};

const headingComponents = {
    text: 'Poll Management',
    heading: true
};

const headingMore = {
    text: 'Contact',
    heading: true
};

const headingOthers = {
    text: 'Others',
    heading: true
};

export const menu = [
    headingMain,
    Home,
    headingComponents,
    Dashboard,
    Createpoll,
    Reportpoll,
    headingMore,
    Invite,
    headingOthers,
    Logout
];

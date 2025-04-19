import { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Page, Text, View, Document, StyleSheet,
  PDFDownloadLink 
} from '@react-pdf/renderer';
import { 
  PieChart, Pie, Cell, BarChart, Bar, 
  LineChart, Line, RadarChart, Radar, 
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';


/* ----------------------------------------------
   1) Configuration des Permissions
---------------------------------------------- */
const permissionMapping = {
  CLIMAT: {
    "Carte Neige": 1,
    "Carte Ecart-RR-ABH": 2,
    "Climatologie‑Réanalyses": 3,
    "Suivi-Sécheresse": 4,
    "Indicateurs-DBClimat": 5,
    "Records": 6,
    "Qualité de l'air": 7,
  },
  OBSERVATION: {
    "Obsmet-Maroc": 8,
    "Planche-Quotidienne": 9,
    "Planche-Provinciale": 10,
    "Planche-Horaire": 11,
    "Planche-Décadaire": 12,
    "Planche-Précipitation": 13,
    "Planche-Neige": 14,
    "Postes - Auxiliaires": 15,
    "Pluvio-Urbain": 16,
    "Obsmap-Maroc": 17,
    "Map-Observation": 18,
    "Map-Précipitation": 19,
  },
  TELEDETECTION: {
    "Satellite-Standard": 20,
    "Satellite-Developpe": 21,
    "Radar-Standard": 22,
    "Radar-Developpe": 23,
    "Foudre-Standard": 24,
  },
  MODELISATION: {
    "Météographes": 25,
    "Modele-NUMERIQUE": 26,
    "Modele-MARINE": 27,
  },
  PREVISION: {
    "Prévision-Maroc": 28,
    "Prévision-Monde": 29,
    "Prévision-Ma-Plage": 30,
    "Légende icones": 31,
  },
  CARTOGRAPHIE: {
    "Map-Vigilances": 32,
    "Map-Modeles": 33,
    "Map-Observation": 34,
    "Ma-Plage": 35,
  },
};

const permissionOptions = {
  CLIMAT: [
    { label: "Carte Neige", icon: "❄️" },
    { label: "Carte Ecart-RR-ABH", icon: "📊" },
    { label: "Climatologie‑Réanalyses", icon: "📈" },
    { label: "Suivi-Sécheresse", icon: "💧" },
    { label: "Indicateurs-DBClimat", icon: "⚙️" },
    { label: "Records", icon: "🏆" },
    { label: "Qualité de l'air", icon: "🌬️" },
  ],
  OBSERVATION: [
    { label: "Obsmet-Maroc", icon: "🔭" },
    { label: "Planche-Quotidienne", icon: "🗓️" },
    { label: "Planche-Provinciale", icon: "📅" },
    { label: "Planche-Horaire", icon: "⏰" },
    { label: "Planche-Décadaire", icon: "📆" },
    { label: "Planche-Précipitation", icon: "🌧️" },
    { label: "Planche-Neige", icon: "❄️" },
    { label: "Postes - Auxiliaires", icon: "⚡" },
    { label: "Pluvio-Urbain", icon: "🌂" },
    { label: "Obsmap-Maroc", icon: "🗺️" },
    { label: "Map-Observation", icon: "🗺️" },
    { label: "Map-Précipitation", icon: "🗺️" },
  ],
  TELEDETECTION: [
    { label: "Satellite-Standard", icon: "🛰️" },
    { label: "Satellite-Developpe", icon: "🚀" },
    { label: "Radar-Standard", icon: "📡" },
    { label: "Radar-Developpe", icon: "📡" },
    { label: "Foudre-Standard", icon: "⚡" },
  ],
  MODELISATION: [
    { label: "Météographes", icon: "🌤️" },
    { label: "Modele-NUMERIQUE", icon: "💻" },
    { label: "Modele-MARINE", icon: "🚢" },
  ],
  PREVISION: [
    { label: "Prévision-Maroc", icon: "🌦️" },
    { label: "Prévision-Monde", icon: "🌍" },
    { label: "Prévision-Ma-Plage", icon: "🏖️" },
    { label: "Légende icones", icon: "📜" },
  ],
  CARTOGRAPHIE: [
    { label: "Map-Vigilances", icon: "🗺️" },
    { label: "Map-Modeles", icon: "🗺️" },
    { label: "Map-Observation", icon: "🗺️" },
    { label: "Ma-Plage", icon: "🏝️" },
  ],
};

const initialPermissions = {
  CLIMAT: {
    "Carte Neige": false,
    "Carte Ecart-RR-ABH": false,
    "Climatologie‑Réanalyses": false,
    "Suivi-Sécheresse": false,
    "Indicateurs-DBClimat": false,
    "Records": false,
    "Qualité de l'air": false,
  },
  OBSERVATION: {
    "Obsmet-Maroc": false,
    "Planche-Quotidienne": false,
    "Planche-Provinciale": false,
    "Planche-Horaire": false,
    "Planche-Décadaire": false,
    "Planche-Précipitation": false,
    "Planche-Neige": false,
    "Postes - Auxiliaires": false,
    "Pluvio-Urbain": false,
    "Obsmap-Maroc": false,
    "Map-Observation": false,
    "Map-Précipitation": false,
  },
  TELEDETECTION: {
    "Satellite-Standard": false,
    "Satellite-Developpe": false,
    "Radar-Standard": false,
    "Radar-Developpe": false,
    "Foudre-Standard": false,
  },
  MODELISATION: {
    "Météographes": false,
    "Modele-NUMERIQUE": false,
    "Modele-MARINE": false,
  },
  PREVISION: {
    "Prévision-Maroc": false,
    "Prévision-Monde": false,
    "Prévision-Ma-Plage": false,
    "Légende icones": false,
  },
  CARTOGRAPHIE: {
    "Map-Vigilances": false,
    "Map-Modeles": false,
    "Map-Observation": false,
    "Ma-Plage": false,
  }
};

/* ----------------------------------------------
   2) Fonction utilitaire
---------------------------------------------- */
const transformPermissions = (permissions, mapping) => {
  let permissionIds = [];
  Object.keys(permissions).forEach(category => {
    Object.keys(permissions[category]).forEach(label => {
      if (permissions[category][label] && mapping[category]?.[label]) {
        permissionIds.push(mapping[category][label]);
      }
    });
  });
  return permissionIds;
};

/* ----------------------------------------------
   3) Composant DashboardPDF
---------------------------------------------- */
const DashboardPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.title}>Rapport du Dashboard Administrateur</Text>
        <Text style={pdfStyles.dateRange}>
          Généré le {new Date().toLocaleDateString()}
        </Text>
      </View>

      <View style={pdfStyles.kpiContainer}>
        <View style={pdfStyles.kpi}>
          <Text style={pdfStyles.kpiTitle}>Utilisateurs Actifs</Text>
          <Text style={pdfStyles.kpiValue}>{data.kpis.activeUsers || 0}</Text>
        </View>
        <View style={pdfStyles.kpi}>
          <Text style={pdfStyles.kpiTitle}>Nouveaux Utilisateurs</Text>
          <Text style={pdfStyles.kpiValue}>{data.kpis.newUsers || 0}</Text>
        </View>
        <View style={pdfStyles.kpi}>
          <Text style={pdfStyles.kpiTitle}>Demandes MDP</Text>
          <Text style={pdfStyles.kpiValue}>{data.kpis.passwordRequests || 0}</Text>
        </View>
        <View style={pdfStyles.kpi}>
          <Text style={pdfStyles.kpiTitle}>Taux d'Activation</Text>
          <Text style={pdfStyles.kpiValue}>{data.kpis.activationRate || '0%'}</Text>
        </View>
      </View>

      <View style={pdfStyles.chartContainer}>
        <Text style={pdfStyles.chartTitle}>Dernières activités</Text>
        {data.users.slice(0, 5).map((user, index) => (
          <Text key={index}>
            {user.name} - {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Jamais connecté'}
          </Text>
        ))}
      </View>

      <View style={pdfStyles.footer}>
        <Text>Généré automatiquement par le système</Text>
      </View>
    </Page>
  </Document>
);
DashboardPDF.propTypes = {
  data: PropTypes.shape({
    kpis: PropTypes.shape({
      activeUsers: PropTypes.number,
      newUsers: PropTypes.number,
      passwordRequests: PropTypes.number,
      activationRate: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
      ])
    }),
    users: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      last_login_at: PropTypes.string
    })),
    passwordRequests: PropTypes.array
  }).isRequired
};

const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  dateRange: {
    fontSize: 12,
    color: '#666',
  },
  kpiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  kpi: {
    width: '24%',
    padding: 10,
    border: '1px solid #eee',
    borderRadius: 4,
  },
  kpiTitle: {
    fontSize: 12,
    marginBottom: 5,
    color: '#666',
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    marginBottom: 10,
    borderBottom: '1px solid #eee',
    paddingBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
  },
});

/* ----------------------------------------------
   4) Composant DashboardStats
---------------------------------------------- */
const DashboardStats = ({ users, passwordRequests }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  });
  
  const [stats, setStats] = useState({
    kpis: {},
    activityData: [],
    permissionStats: [],
    roleData: [],
    loading: true
  });

  const fetchDashboardData = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      const params = {
        start_date: dateRange.start.toISOString().split('T')[0],
        end_date: dateRange.end.toISOString().split('T')[0]
      };

      const [statsRes, activityRes, permissionsRes] = await Promise.all([
        axios.get('/admin/stats', { params }),
        axios.get('/admin/activity-data', { params }),
        axios.get('/admin/permission-stats', { params })
      ]);

      setStats({
        kpis: statsRes.data.kpis || {},
        activityData: activityRes.data || [],
        permissionStats: permissionsRes.data || [],
        roleData: [
          { name: 'Admins', value: statsRes.data.adminCount || 0 },
          { name: 'Utilisateurs', value: statsRes.data.userCount || 0 }
        ],
        loading: false
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };
  DashboardStats.propTypes = {
    users: PropTypes.array.isRequired,
    passwordRequests: PropTypes.array.isRequired
  };
  

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // chaque 30 secondes
  
    return () => clearInterval(interval); 
  }, []);
  

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Type,Date,Valeur\n";
    
    stats.activityData.forEach(item => {
      csvContent += `Activité,${item.date},${item.count}\n`;
    });
    
    passwordRequests.forEach(item => {
      csvContent += `Demande MDP,${new Date(item.created_at).toLocaleDateString()},1\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `dashboard-${new Date().toISOString().split('T')[0]}.csv`);
  };
  {stats.loading && (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-500 border-solid"></div>
    </div>
  )}  
  return (
    
    <div className="space-y-8">
      {stats.loading && (
  <div className="flex justify-center items-center h-40">
    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-500 border-solid"></div>
  </div>
)}

      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date de début</label>
            <input 
              type="date" 
              value={dateRange.start.toISOString().split('T')[0]} 
              onChange={e => setDateRange({...dateRange, start: new Date(e.target.value)})}
              className="p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date de fin</label>
            <input 
              type="date" 
              value={dateRange.end.toISOString().split('T')[0]} 
              onChange={e => setDateRange({...dateRange, end: new Date(e.target.value)})}
              className="p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-full flex items-center gap-2"
          >
            <span>Export CSV</span>
            <span>📊</span>
          </button>
          
          <PDFDownloadLink 
            document={<DashboardPDF data={{ ...stats, users, passwordRequests }} />} 
            fileName="dashboard.pdf"
            className="px-4 py-2 bg-red-600 text-white rounded-full flex items-center gap-2"
          >
            {({ loading }) => loading ? 'Génération...' : 'Export PDF 📄'}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Utilisateurs Actifs", value: stats.kpis.activeUsers, change: stats.kpis.activeUsersChange, icon: "👥" },
          { title: "Nouveaux Utilisateurs", value: stats.kpis.newUsers, change: stats.kpis.newUsersChange, icon: "🆕" },
          { title: "Demandes MDP", value: stats.kpis.passwordRequests, change: stats.kpis.passwordRequestsChange, icon: "🔑" },
          { title: "Taux d'Activation", value: stats.kpis.activationRate, change: stats.kpis.activationRateChange, icon: "📈" }
        ].map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{kpi.title}</p>
                <p className="text-3xl font-bold mt-2">{kpi.value || 0}</p>
                <p className={`text-sm mt-1 ${kpi.change?.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {kpi.change || ''}
                </p>
              </div>
              <span className="text-3xl">{kpi.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Répartition des rôles</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.roleData}
                cx="50%"
                cy="50%"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {stats.roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} utilisateurs`, 'Nombre']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Activité des utilisateurs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} connexions`, 'Nombre']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationBegin={200}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Demandes de réinitialisation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={passwordRequests}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="created_at" 
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => `Date: ${new Date(date).toLocaleDateString()}`}
                formatter={(value) => [`${value} demandes`, 'Nombre']}
              />
              <Legend />
              <Bar 
                dataKey="count" 
                fill="#8884d8" 
                animationBegin={400}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Utilisation des permissions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={stats.permissionStats}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <Tooltip formatter={(value) => [`${value} utilisateurs`, 'Nombre']} />
              <Radar 
                name="Permissions" 
                dataKey="count" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6} 
                animationBegin={600}
                animationDuration={1000}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------------
   5) Composant Admin principal
---------------------------------------------- */
const Admin = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    profile_photo: '/default-avatar.png',
    profile_photo_file: null,
  });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    profile_photo: null,
    permissions: initialPermissions,
  });
  const [passwordRequests, setPasswordRequests] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      const usersData = response.data.users || [];
      const usersWithPermissions = usersData.map(user => ({
        ...user,
        permissions: user.permissions ? JSON.parse(user.permissions) : []
      }));
      setUsers(usersWithPermissions);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const fetchPasswordRequests = async () => {
    try {
      const res = await axios.get('/password-requests');
      setPasswordRequests(res.data.requests || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des demandes MDP:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes] = await Promise.all([
          axios.get('/profile'),
          fetchUsers(),
        ]);
        const profileData = profileRes.data;
        if (profileData.profile_photo) {
          setCurrentUser({
            ...profileData,
            profile_photo: profileData.profile_photo || '/default-avatar.png',
            profile_photo_file: null,
          });
        } else {
          setCurrentUser({ ...profileData, profile_photo: '/default-avatar.png', profile_photo_file: null });
        }
        await fetchPasswordRequests();
      } catch (error) {
        console.error('Erreur de chargement des données:', error);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (isEditing) {
      setEditingUser(prev => ({ ...prev, profile_photo: preview, profile_photo_file: file }));
    } else {
      setCurrentUser(prev => ({ ...prev, profile_photo: preview, profile_photo_file: file }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', currentUser.name);
    formData.append('email', currentUser.email);
    if (currentUser.profile_photo_file) {
      formData.append('profile_photo', currentUser.profile_photo_file);
    } else if (!currentUser.profile_photo || currentUser.profile_photo === '/default-avatar.png') {
      formData.append('remove_photo', '1');
    }
    if (currentUser.password) {
      formData.append('password', currentUser.password);
    }
    try {
      await axios.post('/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const res = await axios.get('/profile');
      const data = res.data;
      setCurrentUser({
        ...data,
        profile_photo: data.profile_photo ? `${import.meta.env.VITE_REACT_APP_API_URL}/storage/${data.profile_photo}` : '/default-avatar.png',
        profile_photo_file: null,
      });
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur:', error.response?.data || error);
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newUser.name);
    formData.append('email', newUser.email);
    formData.append('password', newUser.password);
    formData.append('role', newUser.role);
    if (newUser.profile_photo) {
      formData.append('profile_photo', newUser.profile_photo);
    }
    const permissionIds = transformPermissions(newUser.permissions, permissionMapping);
    permissionIds.forEach(id => formData.append('permissions[]', id));
    try {
      await axios.post('/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchUsers();
      toast.success('Utilisateur créé avec succès');
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'user',
        profile_photo: null,
        permissions: initialPermissions
      });
    } catch (error) {
      console.error('Erreur de création:', error.response?.data || error);
      toast.error("Erreur lors de la création de l'utilisateur");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Confirmer la suppression ?')) {
      try {
        await axios.delete(`/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
        toast.success("Utilisateur supprimé");
      } catch (error) {
        console.error('Erreur de suppression:', error);
      }
    }
  };

  const mapPermissionsToStructure = (permissionIds) => {
    const permissions = JSON.parse(JSON.stringify(initialPermissions));
    
    if (!permissionIds || !Array.isArray(permissionIds)) {
      return permissions;
    }

    Object.entries(permissionMapping).forEach(([category, perms]) => {
      Object.entries(perms).forEach(([label, permId]) => {
        if (permissionIds.includes(permId)) {
          permissions[category][label] = true;
        }
      });
    });

    return permissions;
  };

  const handleEditUser = (user) => {
    setEditingUser({
      ...user,
      permissions: mapPermissionsToStructure(user.permissions),
      profile_photo: user.profile_photo || '/default-avatar.png',
      profile_photo_file: null
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', editingUser.name);
    formData.append('email', editingUser.email);
    formData.append('role', editingUser.role);
    
    if (editingUser.profile_photo_file) {
      formData.append('profile_photo', editingUser.profile_photo_file);
    }
    
    if (editingUser.password) {
      formData.append('password', editingUser.password);
    }
    
    const permissionIds = transformPermissions(editingUser.permissions, permissionMapping);
    permissionIds.forEach(id => formData.append('permissions[]', id));
    
    try {
      await axios.post(`/users/${editingUser.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchUsers();
      setEditingUser(null);
      toast.success("Utilisateur mis à jour !");
    } catch (error) {
      console.error('Erreur de mise à jour:', error.response?.data || error);
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRequestPasswordChange = (id, newValue) => {
    setPasswordRequests(prev =>
      prev.map(req => req.id === id ? { ...req, newPassword: newValue } : req)
    );
  };

  const handleSetNewPassword = async (id) => {
    const request = passwordRequests.find(r => r.id === id);
    if (!request) return;
    if (!request.newPassword || request.newPassword.length < 4) {
      toast.error("Veuillez saisir un mot de passe d'au moins 4 caractères.");
      return;
    }
    try {
      await axios.post(`/password-requests/${id}`, {
        new_password: request.newPassword,
      });
      toast.success(`Mot de passe mis à jour pour ${request.user_email}`);
      setPasswordRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Erreur mise à jour MDP:', err);
      toast.error("Erreur lors de la mise à jour du mot de passe");
    }
  };

  const handleDeletePasswordRequest = async (id) => {
    if (!window.confirm("Confirmer la suppression de la demande ?")) return;
  
    try {
      const response = await axios.delete(`/password-requests/${id}`);
      console.log("Suppression réussie:", response.data);
      
      setPasswordRequests(prev => prev.filter(req => req.id !== id));
  
      toast.success("Demande supprimée !");
    } catch (error) {
      console.error("Erreur lors de la suppression de la demande:", error.response?.data || error);
      toast.error("Erreur lors de la suppression de la demande");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="w-full bg-white shadow p-4 flex justify-center">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-gray-700">Bonjour, Admin</span>
          <img
            src={currentUser.profile_photo || '/default-avatar.png'}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-4 border-indigo-600 mt-2"
          />
        </div>
      </header>

      <div className="flex flex-1">
        <div className="w-64 bg-gradient-to-b from-indigo-600 to-purple-600 p-6 flex flex-col shadow-lg">
          <nav className="flex-1 space-y-3 mt-6">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full text-left p-3 rounded-full flex items-center space-x-2 transition transform duration-200 ${activeSection === 'dashboard' ? 'bg-white text-indigo-700 shadow-lg' : 'text-white hover:bg-indigo-700 hover:scale-105'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4.5l9 5.25v6.75a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 16.5V9.75z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 22.5V12h6v10.5" />
              </svg>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveSection('profile')}
              className={`w-full text-left p-3 rounded-full flex items-center space-x-2 transition transform duration-200 ${activeSection === 'profile' ? 'bg-white text-indigo-700 shadow-lg' : 'text-white hover:bg-indigo-700 hover:scale-105'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Mon Profil</span>
            </button>

            <button
              onClick={() => setActiveSection('createUser')}
              className={`w-full text-left p-3 rounded-full flex items-center space-x-2 transition transform duration-200 ${activeSection === 'createUser' ? 'bg-white text-indigo-700 shadow-lg' : 'text-white hover:bg-indigo-700 hover:scale-105'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 8a6 6 0 11-12 0 6 6 0 0112 0zM8 14v6m-3-3h6" />
              </svg>
              <span>Créer Utilisateur</span>
            </button>

            <button
              onClick={() => setActiveSection('users')}
              className={`w-full text-left p-3 rounded-full flex items-center space-x-2 transition transform duration-200 ${activeSection === 'users' ? 'bg-white text-indigo-700 shadow-lg' : 'text-white hover:bg-indigo-700 hover:scale-105'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5V8H2v12h5m10-12a3 3 0 110-6 3 3 0 010 6zm-9 0a3 3 0 110-6 3 3 0 010 6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 20c0-2 4-4 7-4s7 2 7 4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c3 0 7 2 7 4" />
              </svg>
              <span>Utilisateurs</span>
            </button>

            <button
              onClick={() => setActiveSection('passwordRequests')}
              className={`w-full text-left p-3 rounded-full flex items-center space-x-2 transition transform duration-200 ${activeSection === 'passwordRequests' ? 'bg-white text-indigo-700 shadow-lg' : 'text-white hover:bg-indigo-700 hover:scale-105'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c.667 0 1 .333 1 1v2m-1 0h1m-2 0h1m-1-2a1 1 0 10-2 0v2m2-2v2m-5 2h14a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 012-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span>Mots de Passe</span>
            </button>
          </nav>

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center space-x-2 text-red-200 hover:text-red-100 transition transform duration-200 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Déconnexion</span>
          </button>
        </div>

        <main className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence exitBeforeEnter>
            {editingUser && (
              <motion.div
                key="editUser"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-10 bg-white rounded-xl shadow-lg p-8 border border-gray-200"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Édition Utilisateur</h2>
                <form onSubmit={handleSaveEdit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom</label>
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Photo de profil</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, true)}
                        className="w-full p-2 border rounded mt-2"
                        accept="image/*"
                      />
                      {editingUser.profile_photo && (
                        <img
                          src={editingUser.profile_photo}
                          className="w-20 h-20 rounded-full mt-3"
                          alt="Profile"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rôle</label>
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="w-full p-3 border rounded mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Permissions</h3>
                    {Object.entries(permissionOptions).map(([category, perms]) => {
                      const categoryPermissions = editingUser.permissions[category];
                      const allChecked = Object.values(categoryPermissions).every(v => v);
                      
                      return (
                        <div key={category} className="mb-5">
                          <div className="flex items-center space-x-2 mb-3">
                            <input
                              type="checkbox"
                              checked={allChecked}
                              onChange={(e) => {
                                const newPermissions = { ...editingUser.permissions };
                                newPermissions[category] = Object.keys(newPermissions[category])
                                  .reduce((acc, label) => {
                                    acc[label] = e.target.checked;
                                    return acc;
                                  }, {});
                                setEditingUser({ ...editingUser, permissions: newPermissions });
                              }}
                              className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <h4 className="font-medium text-gray-700">{category}</h4>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-4">
                            {perms.map(perm => (
                              <label key={perm.label} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                                <input
                                  type="checkbox"
                                  checked={editingUser.permissions[category]?.[perm.label] || false}
                                  onChange={(e) => {
                                    const newPermissions = { ...editingUser.permissions };
                                    newPermissions[category][perm.label] = e.target.checked;
                                    setEditingUser({ ...editingUser, permissions: newPermissions });
                                  }}
                                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="text-sm">{perm.icon} {perm.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition transform duration-200"
                    >
                      Sauvegarder
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-400 text-white px-6 py-3 rounded-full hover:bg-gray-500 transition transform duration-200"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeSection === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <DashboardStats users={users} passwordRequests={passwordRequests} />
              </motion.div>
            )}

            {activeSection === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
              >
                <div className="p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <h1 className="text-3xl font-bold">Profil Administrateur</h1>
                </div>
                
                <div className="p-8 grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 flex flex-col items-center relative group">
                    <img
                      src={currentUser.profile_photo || '/default-avatar.png'}
                      alt="Profile"
                      className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                    <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-indigo-50">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e)}
                        className="hidden"
                      />
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </label>
                    <div className="mt-6 text-center space-y-2">
                      <h3 className="text-2xl font-bold text-gray-800">{currentUser.name}</h3>
                      <p className="text-gray-600">{currentUser.email}</p>
                      <div className="inline-flex items-center bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        {currentUser.role}
                      </div>
                    </div>
                    <div className="mt-6 w-full space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Inscrit le :</span>
                        <span>
                          {currentUser.created_at
                            ? new Date(currentUser.created_at).toLocaleDateString()
                            : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Dernière connexion :</span>
                        <span>
                          {currentUser.last_login_at
                            ? new Date(currentUser.last_login_at).toLocaleString()
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom complet
                          </label>
                          <input
                            type="text"
                            value={currentUser.name || ''}
                            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Adresse email
                          </label>
                          <input
                            type="email"
                            value={currentUser.email || ''}
                            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nouveau mot de passe
                          </label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-full hover:bg-indigo-700 transition-colors font-medium"
                      >
                        Mettre à jour le profil
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'createUser' && (
              <motion.div
                key="createUser"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Créer un nouvel utilisateur</h2>
                <form onSubmit={handleCreateUser} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                      <input
                        type="text"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adresse email</label>
                      <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                      <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Photo de profil</label>
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setNewUser({ ...newUser, profile_photo: file });
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <fieldset className="border p-4 rounded-lg">
                    <legend className="text-lg font-semibold text-gray-800 px-2">Permissions</legend>
                    {Object.entries(permissionOptions).map(([category, perms]) => {
                      const categoryPermissions = newUser.permissions[category];
                      const allChecked = Object.values(categoryPermissions).every(v => v);
                      
                      return (
                        <div key={category} className="mt-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <input
                              type="checkbox"
                              checked={allChecked}
                              onChange={(e) => {
                                const newPermissions = { ...newUser.permissions };
                                newPermissions[category] = Object.keys(newPermissions[category])
                                  .reduce((acc, label) => {
                                    acc[label] = e.target.checked;
                                    return acc;
                                  }, {});
                                setNewUser({ ...newUser, permissions: newPermissions });
                              }}
                              className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <h4 className="font-medium text-gray-700">{category}</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
                            {perms.map(perm => (
                              <label
                                key={perm.label}
                                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
                              >
                                <input
                                  type="checkbox"
                                  checked={newUser.permissions[category][perm.label]}
                                  onChange={(e) => {
                                    const newPermissions = { ...newUser.permissions };
                                    newPermissions[category][perm.label] = e.target.checked;
                                    setNewUser({ ...newUser, permissions: newPermissions });
                                  }}
                                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                />
                                <span>{perm.icon} {perm.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </fieldset>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-full hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Créer l'utilisateur
                  </button>
                </form>
              </motion.div>
            )}

            {activeSection === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
              >
                <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Utilisateurs</h2>
                  <div className="relative mt-4 md:mt-0">
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Rechercher par nom..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={user.profile_photo || '/default-avatar.png'}
                          alt="Profile"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition transform duration-150"
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition transform duration-150"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === 'passwordRequests' && (
              <motion.div
                key="passwordRequests"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestion des Mots de Passe Oubliés</h2>
                {passwordRequests.length === 0 ? (
                  <p className="text-gray-600">Aucune demande pour le moment.</p>
                ) : (
                  <div className="space-y-4">
                    {passwordRequests.map((req) => (
                      <div key={req.id} className="p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                        <img
                          src={req.user_profile_photo || '/default-avatar.png'}
                          alt="Profile"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {req.user_name} ({req.user_email})
                          </p>
                          <p className="text-sm text-gray-500">Rôle : {req.user_role}</p>
                          <p className="text-sm text-gray-500">Raison : {req.reason}</p>
                          <p className="text-xs text-gray-400">
                            Demande créée le : {new Date(req.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Nouveau mot de passe
                          </label>
                          <input
                            type="password"
                            className="w-full md:w-64 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                            value={req.newPassword || ''}
                            onChange={(e) => handleRequestPasswordChange(req.id, e.target.value)}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSetNewPassword(req.id)}
                              className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition transform duration-150"
                            >
                              Définir
                            </button>
                            <button
                              onClick={() => handleDeletePasswordRequest(req.id)}
                              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition transform duration-150"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Admin;
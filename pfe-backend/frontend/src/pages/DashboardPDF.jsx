import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

// Enregistrement de la police Roboto
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc9.ttf', fontWeight: 700 },
  ],
});

// Palette de couleurs moderne
const colors = {
  primary: '#3f51b5',
  secondary: '#2196f3',
  success: '#4caf50',
  warning: '#ff9800',
  danger: '#f44336',
  dark: '#212121',
  light: '#f5f7ff',
  text: '#333333',
  muted: '#666666'
};

// Styles PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Roboto',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
    borderBottom: `2px solid ${colors.primary}`,
    paddingBottom: 20,
    backgroundColor: colors.light,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: colors.primary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  dateRange: {
    fontSize: 12,
    color: colors.muted,
    fontStyle: 'italic',
  },
  kpiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    backgroundColor: '#eef3ff',
    borderRadius: 8,
    padding: 20,
  },
  kpiItem: {
    alignItems: 'center',
    flex: 1,
  },
  kpiTitle: {
    fontSize: 14,
    marginBottom: 8,
    color: colors.text,
    fontWeight: 'bold',
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: colors.primary,
    fontWeight: 'bold',
    borderBottom: `2px solid ${colors.secondary}`,
    paddingBottom: 5,
    backgroundColor: '#e9f0ff',
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  chartContainer: {
    marginBottom: 25,
    backgroundColor: '#fefefe',
    padding: 15,
    borderRadius: 8,
    border: `1px solid ${colors.light}`,
  },
  chartTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: colors.dark,
    fontWeight: 'bold',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
    marginTop: 20,
    borderBottom: `1px solid ${colors.muted}`,
    borderLeft: `1px solid ${colors.muted}`,
    paddingLeft: 10,
  },
  bar: {
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'flex-end',
  },
  barFill: {
    borderRadius: 4,
  },
  barLabel: {
    textAlign: 'center',
    fontSize: 10,
    marginTop: 5,
    color: colors.text,
  },
  activityList: {
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: `1px dashed ${colors.light}`,
  },
  userName: {
    fontWeight: 'bold',
    color: colors.text,
    flex: 2,
  },
  userDate: {
    color: colors.muted,
    fontStyle: 'italic',
    flex: 1,
    textAlign: 'right',
  },
  activationRate: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  rateValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.success,
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: colors.muted,
    borderTop: `1px solid ${colors.light}`,
    paddingTop: 10,
  },
});

// BarChart Component
const BarChart = ({ data, colors }) => (
  <View style={styles.barChart}>
    {data.map((item, index) => (
      <View key={index} style={styles.bar}>
        <View style={[
          styles.barFill,
          {
            height: `${item.value * 2}px`,
            backgroundColor: colors[index % colors.length]
          }
        ]} />
        <Text style={styles.barLabel}>{item.label}</Text>
      </View>
    ))}
  </View>
);

BarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

// DashboardPDF Component
const DashboardPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>Rapport du Dashboard Administrateur</Text>
        <Text style={styles.dateRange}>
          Généré le {new Date().toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>

      {/* KPIs */}
      <View style={styles.kpiContainer}>
        <View style={styles.kpiItem}>
          <Text style={styles.kpiTitle}>Utilisateurs Actifs</Text>
          <Text style={styles.kpiValue}>{data.kpis.activeUsers || 0}</Text>
        </View>
        <View style={styles.kpiItem}>
          <Text style={styles.kpiTitle}>Nouveaux Utilisateurs</Text>
          <Text style={styles.kpiValue}>{data.kpis.newUsers || 0}</Text>
        </View>
        <View style={styles.kpiItem}>
          <Text style={styles.kpiTitle}>Demandes MDP</Text>
          <Text style={styles.kpiValue}>{data.kpis.passwordRequests || 0}</Text>
        </View>
      </View>

      {/* Graphique */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Activité des utilisateurs (7 jours)</Text>
        <BarChart
          data={data.userActivity}
          colors={[colors.primary, colors.secondary, colors.success, colors.warning, colors.danger]}
        />
      </View>

      {/* Activités récentes */}
      <Text style={styles.sectionTitle}>Dernières activités</Text>
      <View style={styles.activityList}>
        {data.users.slice(0, 5).map((user, index) => (
          <View key={index} style={styles.activityItem}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userDate}>
              {user.last_login_at
                ? new Date(user.last_login_at).toLocaleString('fr-FR')
                : 'Jamais connecté'}
            </Text>
          </View>
        ))}
      </View>

      {/* Taux d'activation */}
      <View style={styles.activationRate}>
        <Text>Taux d&apos;Activation</Text>
        <Text style={styles.rateValue}>{data.kpis.activationRate || '0%'}</Text>
      </View>

      {/* Pied de page */}
      <View style={styles.footer}>
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
      activationRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    userActivity: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ).isRequired,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        last_login_at: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

export default DashboardPDF;

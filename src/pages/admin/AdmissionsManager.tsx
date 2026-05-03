// Admin's Admissions page — delegates to the shared component
import SharedAdmissionsManager from '@/pages/shared/AdmissionsManager';
export default function AdmissionsManager() {
  return <SharedAdmissionsManager role="admin" />;
}

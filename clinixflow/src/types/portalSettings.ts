export interface PatientPortalSettings {
  allow_track_appointments: boolean;
  allow_confirm_appointments: boolean;
  allow_request_booking: boolean;
  allow_request_certificate: boolean;
  allow_upload_medical_request: boolean;
  allow_view_reports: boolean;
}

export const defaultPortalSettings: PatientPortalSettings = {
  allow_track_appointments: true,
  allow_confirm_appointments: false,
  allow_request_booking: false,
  allow_request_certificate: false,
  allow_upload_medical_request: false,
  allow_view_reports: false,
};

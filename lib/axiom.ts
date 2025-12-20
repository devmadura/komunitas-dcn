import { Axiom } from "@axiomhq/js";

const token = process.env.AXIOM_TOKEN;
const dataset = process.env.AXIOM_DATASET || "dcn-activity-log";

if (!token) {
  console.warn("AXIOM_TOKEN is not set - activity logging disabled");
}

const axiom = token ? new Axiom({ token }) : null;

export type ActivityAction =
  | "login"
  | "logout"
  | "create_quiz"
  | "update_quiz"
  | "delete_quiz"
  | "create_pertemuan"
  | "update_pertemuan"
  | "delete_pertemuan"
  | "create_absensi"
  | "update_absensi"
  | "delete_absensi"
  | "create_admin"
  | "update_admin"
  | "delete_admin"
  | "generate_sertifikat"
  | "update_profile"
  | "delete_photo"
  | "create_code_redeem"
  | "update_code_redeem"
  | "delete_code_redeem"
  | "create_event"
  | "update_event"
  | "delete_event"
  | "create_galeri"
  | "update_galeri"
  | "delete_galeri";

export interface ActivityLog {
  action: ActivityAction;
  admin_email: string;
  admin_name?: string;
  detail: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export async function logActivity(
  action: ActivityAction,
  adminEmail: string,
  detail: string,
  metadata?: Record<string, unknown>,
  adminName?: string
) {
  if (!axiom) {
    console.warn("Axiom not configured - skipping log:", action, adminEmail);
    return;
  }

  try {
    const log: ActivityLog = {
      action,
      admin_email: adminEmail,
      admin_name: adminName,
      detail,
      metadata,
      timestamp: new Date().toISOString(),
    };

    // console.log("Logging to Axiom:", log);
    axiom.ingest(dataset, [log]);
    await axiom.flush();
    console.log("Log sent to Axiom successfully");
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

export async function getActivityLogs(limit: number = 50) {
  if (!axiom) {
    console.warn("Axiom not configured - returning empty logs");
    return [];
  }

  try {
    const result = await axiom.query(
      `['${dataset}'] | sort by _time desc | limit ${limit}`
    );
    return result.matches?.map((match) => match.data) || [];
  } catch (error) {
    console.error("Failed to fetch activity logs:", error);
    return [];
  }
}

export { axiom };

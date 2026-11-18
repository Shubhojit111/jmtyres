/** Event-dependent audit document fields remain unchanged. */
export const auditLogs = db => db.collection('audit_logs');
export const auditIndex = {createdAt:-1};

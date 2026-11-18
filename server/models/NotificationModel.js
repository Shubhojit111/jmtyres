/** Persist attempts before delivery; status demo_log_only is not a sent message. */
export const notificationLogs = db => db.collection('notification_logs');
export const notificationIndexes = [{key:{key:1},unique:true},{key:{createdAt:-1}}];

/** Server-side JWT jti records; userId is a native BSON ObjectId reference. */
export const sessions = db => db.collection('sessions');
export const sessionIndexes = [{key:{id:1},unique:true},{key:{expiresAt:1},expireAfterSeconds:0}];

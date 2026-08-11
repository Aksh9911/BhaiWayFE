
const SHEET_ID = '${DEMO_GOOGLE_SHEET_ID}';
const USER_ID_START = 1001;
const VEHICLE_ID_START = 2001;

const USER_HEADERS = [
  'UserID',
  'UserName',
  'Email',
  'AadharNumber',
  'CorporateID',
  'VehicleModel',
  'VehicleColor',
  'VehicleType',
  'VehicleNumberPlate',
  'BhaiWayWallet',
  'Mobile',
  'ProfilePicture',
  'RC',
  'CorporateID',
  'Role',
];

const VEHICLE_HEADERS = [
  'VehicleID',
  'UserID',
  'Mobile',
  'VehicleModel',
  'VehicleColor',
  'VehicleType',
  'VehicleNumberPlate',
  'RC',
];

function getUserSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheets()[0];
  sheet.getRange(1, 1, 1, USER_HEADERS.length).setValues([USER_HEADERS]);
  return sheet;
}

function getVehicleSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Vehicles');
  if (!sheet) {
    sheet = ss.insertSheet('Vehicles');
  }
  sheet.getRange(1, 1, 1, VEHICLE_HEADERS.length).setValues([VEHICLE_HEADERS]);
  return sheet;
}

function normalize_(v) {
  return String(v || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function aadhaarKey_(v) {
  var digits = String(v || '').replace(/\D/g, '');
  return digits.slice(-4) || normalize_(v);
}

function nextUserId_(sheet) {
  var values = sheet.getDataRange().getValues();
  var maxId = USER_ID_START - 1;
  for (var i = 1; i < values.length; i++) {
    var id = Number(values[i][0]);
    if (isFinite(id) && id > maxId) maxId = id;
  }
  return maxId + 1;
}

function nextVehicleId_(sheet) {
  var values = sheet.getDataRange().getValues();
  var maxId = VEHICLE_ID_START - 1;
  for (var i = 1; i < values.length; i++) {
    var id = Number(values[i][0]);
    if (isFinite(id) && id > maxId) maxId = id;
  }
  return maxId + 1;
}

function findUserRow_(sheet, row) {
  var values = sheet.getDataRange().getValues();
  var inUserId = Number(row.userId || 0);
  var inName = normalize_(row.userName);
  var inEmail = normalize_(row.email);
  var inAadhaar = aadhaarKey_(row.aadharNumber);
  var inMobile = String(row.mobile || '').replace(/\D/g, '').slice(-10);

  for (var i = 1; i < values.length; i++) {
    var userId = Number(values[i][0]);
    var name = normalize_(values[i][1]);
    var email = normalize_(values[i][2]);
    var aadhaar = aadhaarKey_(values[i][3]);
    var mobile = String(values[i][10] || '').replace(/\D/g, '').slice(-10);
    if (inUserId && userId && inUserId === userId) return i + 1;
    if ((inMobile && mobile && inMobile === mobile) ||
        (inEmail && email && inEmail === email) ||
        (inAadhaar && aadhaar && inAadhaar === aadhaar) ||
        (inName && name && inName === name)) {
      return i + 1;
    }
  }
  return -1;
}

function findVehicleRow_(sheet, row) {
  var values = sheet.getDataRange().getValues();
  var inVehicleId = Number(row.vehicleId || 0);
  var inPlate = String(row.vehicleNumberPlate || '').trim().toUpperCase();
  var inUserId = Number(row.userId || 0);

  for (var i = 1; i < values.length; i++) {
    var vehicleId = Number(values[i][0]);
    var userId = Number(values[i][1]);
    var plate = String(values[i][6] || '').trim().toUpperCase();
    if (inVehicleId && vehicleId && inVehicleId === vehicleId) return i + 1;
    if (inPlate && plate && inPlate === plate && (!inUserId || !userId || inUserId === userId)) {
      return i + 1;
    }
  }
  return -1;
}

function userToValues_(row) {
  return [[
    row.userId != null ? row.userId : '',
    row.userName || '',
    row.email || '',
    row.aadharNumber || '',
    row.corporateId || '',
    row.vehicleModel || '',
    row.vehicleColor || '',
    row.vehicleType || '',
    row.vehicleNumberPlate || '',
    row.bhaiWayWallet != null ? row.bhaiWayWallet : 0,
    row.mobile || '',
    row.profilePicture || '',
    row.rc || '',
    row.corporateIdUrl || '',
    row.role || 'Both',
  ]];
}

function vehicleToValues_(row) {
  return [[
    row.vehicleId != null ? row.vehicleId : '',
    row.userId != null ? row.userId : '',
    row.mobile || '',
    row.vehicleModel || '',
    row.vehicleColor || '',
    row.vehicleType || '',
    row.vehicleNumberPlate || '',
    row.rc || '',
  ]];
}

function handleUser_(payload) {
  var row = payload.row || {};
  var sheet = getUserSheet_();
  var existing = findUserRow_(sheet, row);
  var mode = payload.action === 'insert' ? 'insert' : 'update';

  if (existing > 0) {
    var existingId = Number(sheet.getRange(existing, 1).getValue());
    if (!row.userId && existingId) row.userId = existingId;
    sheet.getRange(existing, 1, 1, USER_HEADERS.length).setValues(userToValues_(row));
    return { ok: true, entity: 'user', mode: 'update', userId: row.userId, row: existing };
  }

  if (!row.userId) row.userId = nextUserId_(sheet);
  if (!row.role) row.role = 'Both';
  sheet.appendRow(userToValues_(row)[0]);
  return { ok: true, entity: 'user', mode: 'insert', userId: row.userId };
}

function handleVehicle_(payload) {
  var row = payload.row || {};
  var sheet = getVehicleSheet_();
  var action = payload.action || 'update';
  var existing = findVehicleRow_(sheet, row);

  if (action === 'delete') {
    if (existing > 0) {
      sheet.deleteRow(existing);
      return { ok: true, entity: 'vehicle', mode: 'delete', vehicleId: row.vehicleId };
    }
    return { ok: true, entity: 'vehicle', mode: 'delete', skipped: true };
  }

  if (existing > 0) {
    var existingId = Number(sheet.getRange(existing, 1).getValue());
    if (!row.vehicleId && existingId) row.vehicleId = existingId;
    sheet.getRange(existing, 1, 1, VEHICLE_HEADERS.length).setValues(vehicleToValues_(row));
    return { ok: true, entity: 'vehicle', mode: 'update', vehicleId: row.vehicleId, row: existing };
  }

  if (!row.vehicleId) row.vehicleId = nextVehicleId_(sheet);
  sheet.appendRow(vehicleToValues_(row)[0]);
  return { ok: true, entity: 'vehicle', mode: 'insert', vehicleId: row.vehicleId };
}

const NOTIFICATION_HEADERS = [
  'NotificationID',
  'UserID',
  'Mobile',
  'Title',
  'Body',
  'TimeLabel',
  'Category',
  'Section',
  'Unread',
  'CreatedAt',
];

const CHAT_THREAD_HEADERS = [
  'ThreadID',
  'ThreadKey',
  'UserID',
  'Mobile',
  'Role',
  'RideType',
  'PeerName',
  'PeerSubtitle',
  'RouteLabel',
  'LastMessage',
  'TimeLabel',
  'UnreadCount',
  'IsOnline',
  'AvatarUri',
];

const CHAT_MESSAGE_HEADERS = [
  'MessageID',
  'ThreadKey',
  'UserID',
  'Mobile',
  'Sender',
  'Text',
  'TimeLabel',
  'Status',
  'CreatedAt',
];

const NOTIFICATION_ID_START = 3001;
const THREAD_ID_START = 4001;
const MESSAGE_ID_START = 5001;

function getOrCreateSheet_(name, headers) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  return sheet;
}

function nextId_(sheet, start) {
  var values = sheet.getDataRange().getValues();
  var maxId = start - 1;
  for (var i = 1; i < values.length; i++) {
    var id = Number(values[i][0]);
    if (isFinite(id) && id > maxId) maxId = id;
  }
  return maxId + 1;
}

function findByFirstColId_(sheet, id) {
  var values = sheet.getDataRange().getValues();
  var inId = Number(id || 0);
  if (!inId) return -1;
  for (var i = 1; i < values.length; i++) {
    if (Number(values[i][0]) === inId) return i + 1;
  }
  return -1;
}

function findChatThreadRow_(sheet, row) {
  var values = sheet.getDataRange().getValues();
  var inId = Number(row.threadId || 0);
  var inKey = String(row.threadKey || '').trim();
  var inMobile = String(row.mobile || '').replace(/\D/g, '').slice(-10);
  for (var i = 1; i < values.length; i++) {
    var threadId = Number(values[i][0]);
    var threadKey = String(values[i][1] || '').trim();
    var mobile = String(values[i][3] || '').replace(/\D/g, '').slice(-10);
    if (inId && threadId && inId === threadId) return i + 1;
    if (inKey && threadKey === inKey && (!inMobile || !mobile || inMobile === mobile)) return i + 1;
  }
  return -1;
}

function findChatMessageRow_(sheet, row) {
  return findByFirstColId_(sheet, row.messageId);
}

function handleNotification_(payload) {
  var row = payload.row || {};
  var sheet = getOrCreateSheet_('Notifications', NOTIFICATION_HEADERS);
  var existing = findByFirstColId_(sheet, row.notificationId);
  var values = [[
    row.notificationId != null ? row.notificationId : '',
    row.userId != null ? row.userId : '',
    row.mobile || '',
    row.title || '',
    row.body || '',
    row.timeLabel || '',
    row.category || 'system',
    row.section || 'today',
    row.unread ? 'TRUE' : 'FALSE',
    row.createdAt || '',
  ]];
  if (existing > 0) {
    sheet.getRange(existing, 1, 1, NOTIFICATION_HEADERS.length).setValues(values);
    return { ok: true, entity: 'notification', mode: 'update', notificationId: row.notificationId };
  }
  if (!row.notificationId) row.notificationId = nextId_(sheet, NOTIFICATION_ID_START);
  values[0][0] = row.notificationId;
  sheet.appendRow(values[0]);
  return { ok: true, entity: 'notification', mode: 'insert', notificationId: row.notificationId };
}

function handleChatThread_(payload) {
  var row = payload.row || {};
  var sheet = getOrCreateSheet_('ChatThreads', CHAT_THREAD_HEADERS);
  var existing = findChatThreadRow_(sheet, row);
  var values = [[
    row.threadId != null ? row.threadId : '',
    row.threadKey || '',
    row.userId != null ? row.userId : '',
    row.mobile || '',
    row.role || 'rider',
    row.rideType || 'outstation',
    row.peerName || '',
    row.peerSubtitle || '',
    row.routeLabel || '',
    row.lastMessage || '',
    row.timeLabel || '',
    row.unreadCount != null ? row.unreadCount : 0,
    row.isOnline ? 'TRUE' : 'FALSE',
    row.avatarUri || '',
  ]];
  if (existing > 0) {
    if (!row.threadId) row.threadId = Number(sheet.getRange(existing, 1).getValue()) || row.threadId;
    values[0][0] = row.threadId;
    sheet.getRange(existing, 1, 1, CHAT_THREAD_HEADERS.length).setValues(values);
    return { ok: true, entity: 'chatThread', mode: 'update', threadId: row.threadId };
  }
  if (!row.threadId) row.threadId = nextId_(sheet, THREAD_ID_START);
  values[0][0] = row.threadId;
  sheet.appendRow(values[0]);
  return { ok: true, entity: 'chatThread', mode: 'insert', threadId: row.threadId };
}

function handleChatMessage_(payload) {
  var row = payload.row || {};
  var sheet = getOrCreateSheet_('ChatMessages', CHAT_MESSAGE_HEADERS);
  var existing = findChatMessageRow_(sheet, row);
  var values = [[
    row.messageId != null ? row.messageId : '',
    row.threadKey || '',
    row.userId != null ? row.userId : '',
    row.mobile || '',
    row.sender || 'user',
    row.text || '',
    row.timeLabel || '',
    row.status || '',
    row.createdAt || '',
  ]];
  if (existing > 0) {
    sheet.getRange(existing, 1, 1, CHAT_MESSAGE_HEADERS.length).setValues(values);
    return { ok: true, entity: 'chatMessage', mode: 'update', messageId: row.messageId };
  }
  if (!row.messageId) row.messageId = nextId_(sheet, MESSAGE_ID_START);
  values[0][0] = row.messageId;
  sheet.appendRow(values[0]);
  return { ok: true, entity: 'chatMessage', mode: 'insert', messageId: row.messageId };
}

const WALLET_TX_HEADERS = [
  'TransactionID',
  'UserID',
  'Mobile',
  'Title',
  'Amount',
  'Type',
  'Icon',
  'DateLabel',
  'Reference',
  'CreatedAt',
];
const WALLET_TX_ID_START = 6001;

function handleWalletTransaction_(payload) {
  var row = payload.row || {};
  var sheet = getOrCreateSheet_('WalletTransactions', WALLET_TX_HEADERS);
  var existing = findByFirstColId_(sheet, row.transactionId);
  var values = [[
    row.transactionId != null ? row.transactionId : '',
    row.userId != null ? row.userId : '',
    row.mobile || '',
    row.title || '',
    row.amount != null ? row.amount : 0,
    row.type || 'credit',
    row.icon || 'card',
    row.dateLabel || '',
    row.reference || '',
    row.createdAt || '',
  ]];
  if (existing > 0) {
    sheet.getRange(existing, 1, 1, WALLET_TX_HEADERS.length).setValues(values);
    return { ok: true, entity: 'walletTransaction', mode: 'update', transactionId: row.transactionId };
  }
  if (!row.transactionId) row.transactionId = nextId_(sheet, WALLET_TX_ID_START);
  values[0][0] = row.transactionId;
  sheet.appendRow(values[0]);
  return { ok: true, entity: 'walletTransaction', mode: 'insert', transactionId: row.transactionId };
}

const PUBLISHED_RIDE_HEADERS = [
  'RideID',
  'UserID',
  'Mobile',
  'RideType',
  'Origin',
  'Destination',
  'DepartureDate',
  'DepartureTime',
  'AvailableSeats',
  'PricePerSeat',
  'Preferences',
  'Notes',
  'VehicleName',
  'VehiclePlate',
  'MaxTwoInBack',
  'WomenOnly',
  'OriginLat',
  'OriginLng',
  'DestLat',
  'DestLng',
  'Status',
  'PublishedAt',
];
const PUBLISHED_RIDE_ID_START = 7001;

const RIDE_BOOKING_HEADERS = [
  'BookingID',
  'RideID',
  'UserID',
  'Mobile',
  'Origin',
  'Destination',
  'DepartureLabel',
  'DriverName',
  'VehicleLabel',
  'SeatsBooked',
  'Amount',
  'Status',
  'PaymentStatus',
  'OriginLat',
  'OriginLng',
  'DestLat',
  'DestLng',
  'BookedAt',
];
const RIDE_BOOKING_ID_START = 8001;

function handlePublishedRide_(payload) {
  var row = payload.row || {};
  var sheet = getOrCreateSheet_('PublishedRides', PUBLISHED_RIDE_HEADERS);
  var existing = findByFirstColId_(sheet, row.rideId);
  var values = [[
    row.rideId != null ? row.rideId : '',
    row.userId != null ? row.userId : '',
    row.mobile || '',
    row.rideType || 'regular',
    row.origin || '',
    row.destination || '',
    row.departureDate || '',
    row.departureTime || '',
    row.availableSeats != null ? row.availableSeats : 0,
    row.pricePerSeat != null ? row.pricePerSeat : '',
    row.preferences || '',
    row.notes || '',
    row.vehicleName || '',
    row.vehiclePlate || '',
    row.maxTwoInBack ? 'TRUE' : 'FALSE',
    row.womenOnly ? 'TRUE' : 'FALSE',
    row.originLat != null ? row.originLat : 0,
    row.originLng != null ? row.originLng : 0,
    row.destLat != null ? row.destLat : 0,
    row.destLng != null ? row.destLng : 0,
    row.status || 'published',
    row.publishedAt || '',
  ]];
  if (existing > 0) {
    sheet.getRange(existing, 1, 1, PUBLISHED_RIDE_HEADERS.length).setValues(values);
    return { ok: true, entity: 'publishedRide', mode: 'update', rideId: row.rideId };
  }
  if (!row.rideId) row.rideId = nextId_(sheet, PUBLISHED_RIDE_ID_START);
  values[0][0] = row.rideId;
  sheet.appendRow(values[0]);
  return { ok: true, entity: 'publishedRide', mode: 'insert', rideId: row.rideId };
}

function handleRideBooking_(payload) {
  var row = payload.row || {};
  var sheet = getOrCreateSheet_('RideBookings', RIDE_BOOKING_HEADERS);
  var existing = findByFirstColId_(sheet, row.bookingId);
  var values = [[
    row.bookingId != null ? row.bookingId : '',
    row.rideId != null ? row.rideId : '',
    row.userId != null ? row.userId : '',
    row.mobile || '',
    row.origin || '',
    row.destination || '',
    row.departureLabel || '',
    row.driverName || '',
    row.vehicleLabel || '',
    row.seatsBooked != null ? row.seatsBooked : 0,
    row.amount != null ? row.amount : 0,
    row.status || 'confirmed',
    row.paymentStatus || 'pending',
    row.originLat != null ? row.originLat : 0,
    row.originLng != null ? row.originLng : 0,
    row.destLat != null ? row.destLat : 0,
    row.destLng != null ? row.destLng : 0,
    row.bookedAt || '',
  ]];
  if (existing > 0) {
    sheet.getRange(existing, 1, 1, RIDE_BOOKING_HEADERS.length).setValues(values);
    return { ok: true, entity: 'rideBooking', mode: 'update', bookingId: row.bookingId };
  }
  if (!row.bookingId) row.bookingId = nextId_(sheet, RIDE_BOOKING_ID_START);
  values[0][0] = row.bookingId;
  sheet.appendRow(values[0]);
  return { ok: true, entity: 'rideBooking', mode: 'insert', bookingId: row.bookingId };
}

const BANK_ACCOUNT_HEADERS = [
  'BankAccountID',
  'UserID',
  'Mobile',
  'HolderName',
  'BankName',
  'AccountNumber',
  'AccountLast4',
  'IFSC',
  'AccountType',
  'Status',
  'CreatedAt',
];
const BANK_ACCOUNT_ID_START = 9001;

function handleBankAccount_(payload) {
  var row = payload.row || {};
  var sheet = getOrCreateSheet_('BankAccounts', BANK_ACCOUNT_HEADERS);
  var existing = findByFirstColId_(sheet, row.bankAccountId);
  var values = [[
    row.bankAccountId != null ? row.bankAccountId : '',
    row.userId != null ? row.userId : '',
    row.mobile || '',
    row.holderName || '',
    row.bankName || '',
    row.accountNumber || '',
    row.accountLast4 || '',
    row.ifsc || '',
    row.accountType || 'Savings Account',
    row.status || 'active',
    row.createdAt || '',
  ]];
  if (existing > 0) {
    sheet.getRange(existing, 1, 1, BANK_ACCOUNT_HEADERS.length).setValues(values);
    return { ok: true, entity: 'bankAccount', mode: 'update', bankAccountId: row.bankAccountId };
  }
  if (!row.bankAccountId) row.bankAccountId = nextId_(sheet, BANK_ACCOUNT_ID_START);
  values[0][0] = row.bankAccountId;
  sheet.appendRow(values[0]);
  return { ok: true, entity: 'bankAccount', mode: 'insert', bankAccountId: row.bankAccountId };
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents || '{}');
    var entity = payload.entity || 'user';
    var result;
    if (entity === 'vehicle') {
      result = handleVehicle_(payload);
    } else if (entity === 'notification') {
      result = handleNotification_(payload);
    } else if (entity === 'chatThread') {
      result = handleChatThread_(payload);
    } else if (entity === 'chatMessage') {
      result = handleChatMessage_(payload);
    } else if (entity === 'walletTransaction') {
      result = handleWalletTransaction_(payload);
    } else if (entity === 'publishedRide') {
      result = handlePublishedRide_(payload);
    } else if (entity === 'rideBooking') {
      result = handleRideBooking_(payload);
    } else if (entity === 'bankAccount') {
      result = handleBankAccount_(payload);
    } else {
      result = handleUser_(payload);
    }
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      service: 'BhaiWay UserDetails + Vehicles Sheet Sync',
    }))
    .setMimeType(ContentService.MimeType.JSON);
}


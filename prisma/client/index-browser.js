
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable',
  Snapshot: 'Snapshot'
});

exports.Prisma.WsBillboardsScalarFieldEnum = {
  ID: 'ID',
  alias: 'alias',
  description: 'description',
  order: 'order',
  is_enabled: 'is_enabled',
  banner_url: 'banner_url',
  created_on: 'created_on',
  created_by: 'created_by'
};

exports.Prisma.WsCategoriesScalarFieldEnum = {
  ID: 'ID',
  Category: 'Category',
  Type: 'Type'
};

exports.Prisma.WsDepartmentsScalarFieldEnum = {
  dep: 'dep',
  alias: 'alias',
  order: 'order',
  app_bar: 'app_bar',
  banner_url: 'banner_url',
  created_on: 'created_on',
  created_by: 'created_by'
};

exports.Prisma.WsHomeBannersScalarFieldEnum = {
  ID: 'ID',
  dep: 'dep',
  image_url: 'image_url'
};

exports.Prisma.WsImagesScalarFieldEnum = {
  vendor_id: 'vendor_id',
  item_number: 'item_number',
  image_url: 'image_url',
  created_on: 'created_on',
  created_by: 'created_by'
};

exports.Prisma.WSJobScalarFieldEnum = {
  ID: 'ID',
  Name: 'Name',
  Description: 'Description',
  Type: 'Type',
  Category: 'Category',
  CreatedOn: 'CreatedOn',
  Active: 'Active',
  StoreId: 'StoreId',
  Status: 'Status',
  CreatedBy: 'CreatedBy',
  MaxSalary: 'MaxSalary',
  MinSalary: 'MinSalary',
  SalaryType: 'SalaryType'
};

exports.Prisma.WSJobApplicationScalarFieldEnum = {
  ID: 'ID',
  JobId: 'JobId',
  UserId: 'UserId',
  IsValid: 'IsValid',
  Status: 'Status',
  Active: 'Active',
  CreatedBy: 'CreatedBy',
  CreatedOn: 'CreatedOn',
  IsDenied: 'IsDenied'
};

exports.Prisma.WSJobApplicationEducationScalarFieldEnum = {
  ID: 'ID',
  JobApplicationId: 'JobApplicationId',
  EducationLevel: 'EducationLevel',
  Name: 'Name',
  Address: 'Address',
  FromDate: 'FromDate',
  ToDate: 'ToDate',
  IsGraduated: 'IsGraduated',
  IsValid: 'IsValid'
};

exports.Prisma.WSJobApplicationFeedbackScalarFieldEnum = {
  ID: 'ID',
  JobApplicationID: 'JobApplicationID',
  Feedback: 'Feedback',
  CreatedBy: 'CreatedBy',
  CreatedOn: 'CreatedOn'
};

exports.Prisma.WSJobApplicationPreviousEmploymentScalarFieldEnum = {
  ID: 'ID',
  JobApplicationId: 'JobApplicationId',
  Company: 'Company',
  Supervisor: 'Supervisor',
  Address: 'Address',
  FromDate: 'FromDate',
  ToDate: 'ToDate',
  JobTitle: 'JobTitle',
  EndingSalary: 'EndingSalary',
  IsHourlyRate: 'IsHourlyRate',
  LeavingReason: 'LeavingReason',
  IsValid: 'IsValid'
};

exports.Prisma.WSJobApplicationReferenceScalarFieldEnum = {
  ID: 'ID',
  JobApplicationId: 'JobApplicationId',
  FullName: 'FullName',
  Relationship: 'Relationship',
  Company: 'Company',
  Phone: 'Phone',
  Email: 'Email',
  IsValid: 'IsValid'
};

exports.Prisma.WsJobApplicationReplyScalarFieldEnum = {
  ID: 'ID',
  FeedbackID: 'FeedbackID',
  Message: 'Message',
  CreatedBy: 'CreatedBy',
  CreatedOn: 'CreatedOn',
  ModifiedOn: 'ModifiedOn'
};

exports.Prisma.WsProductsScalarFieldEnum = {
  vendor_id: 'vendor_id',
  item_number: 'item_number',
  description: 'description',
  ai_description: 'ai_description',
  ai_name: 'ai_name',
  dep: 'dep',
  bucket: 'bucket',
  original_img_url: 'original_img_url',
  final_img_url: 'final_img_url',
  top_sold: 'top_sold',
  is_home: 'is_home',
  is_new_arrival: 'is_new_arrival',
  status: 'status',
  created_on: 'created_on',
  created_by: 'created_by'
};

exports.Prisma.WsProfileScalarFieldEnum = {
  ID: 'ID',
  FirstName: 'FirstName',
  MiddleName: 'MiddleName',
  LastName: 'LastName',
  Gender: 'Gender',
  Age: 'Age',
  Email: 'Email',
  Auth0Id: 'Auth0Id'
};

exports.Prisma.WSStateScalarFieldEnum = {
  ID: 'ID',
  state: 'state',
  st_licenseNumber: 'st_licenseNumber',
  st_expiryDate: 'st_expiryDate',
  st_fileUrl: 'st_fileUrl',
  ll_licenseNumber: 'll_licenseNumber',
  ll_expiryDate: 'll_expiryDate',
  ll_fileUrl: 'll_fileUrl',
  taxExemptId: 'taxExemptId'
};

exports.Prisma.WsStoreScalarFieldEnum = {
  ID: 'ID',
  Name: 'Name',
  Address: 'Address',
  Email: 'Email',
  BookingUrl: 'BookingUrl',
  Latitude: 'Latitude',
  Longitude: 'Longitude',
  PlaceID: 'PlaceID'
};

exports.Prisma.WSTaxExemptScalarFieldEnum = {
  ID: 'ID',
  organization: 'organization',
  organizationDescription: 'organizationDescription',
  number: 'number',
  country: 'country',
  streetAddress: 'streetAddress',
  city: 'city',
  state: 'state',
  zip: 'zip',
  mobileNumber: 'mobileNumber',
  apartment: 'apartment',
  purpose: 'purpose',
  organizationType: 'organizationType',
  name: 'name',
  email: 'email',
  status: 'status',
  states: 'states',
  signerName: 'signerName',
  signerTitle: 'signerTitle',
  signature: 'signature',
  certificateType: 'certificateType'
};

exports.Prisma.WsUserScalarFieldEnum = {
  ID: 'ID',
  Name: 'Name',
  MiddleName: 'MiddleName',
  LastName: 'LastName',
  Street: 'Street',
  Apartment: 'Apartment',
  City: 'City',
  State: 'State',
  Zip: 'Zip',
  Phone: 'Phone',
  SocialSecurity: 'SocialSecurity',
  CanWorkInUs: 'CanWorkInUs',
  IsLegalAge: 'IsLegalAge',
  ServedInMilitary: 'ServedInMilitary',
  MilitaryBranch: 'MilitaryBranch',
  MilitaryRank: 'MilitaryRank',
  MilitaryTypeOfDischarge: 'MilitaryTypeOfDischarge',
  ResumeUrl: 'ResumeUrl',
  Email: 'Email',
  Auth0Id: 'Auth0Id'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  WsBillboards: 'WsBillboards',
  WsCategories: 'WsCategories',
  WsDepartments: 'WsDepartments',
  WsHomeBanners: 'WsHomeBanners',
  WsImages: 'WsImages',
  WSJob: 'WSJob',
  WSJobApplication: 'WSJobApplication',
  WSJobApplicationEducation: 'WSJobApplicationEducation',
  WSJobApplicationFeedback: 'WSJobApplicationFeedback',
  WSJobApplicationPreviousEmployment: 'WSJobApplicationPreviousEmployment',
  WSJobApplicationReference: 'WSJobApplicationReference',
  WsJobApplicationReply: 'WsJobApplicationReply',
  WsProducts: 'WsProducts',
  WsProfile: 'WsProfile',
  WSState: 'WSState',
  WsStore: 'WsStore',
  WSTaxExempt: 'WSTaxExempt',
  WsUser: 'WsUser'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)

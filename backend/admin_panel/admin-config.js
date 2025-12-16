import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import AdminJS from "adminjs";
import dotenv from "dotenv";
import AboutUs from "../models/aboutUs.js";
import clubMain from "../models/clubMain.js";
import Facilities from "../models/facilities.js";
import homepage from "../models/general.js";
import TeamMember from "../models/teamMember.js";
import { contactResourceOptions } from "./contactResource.js";
import { eventResourceOptions } from "./eventResource.js";
import { initiativesResourceOptions } from "./initiativesResource.js";
import { announcementResourceOptions } from "./announcementResource.js";
dotenv.config();

const API_BASE = process.env.NODE_ENV === 'development' ?  (process.env.API_BASE || '') : '/sports-board/api';
const ADMINPANELROOT = `${API_BASE}/admin`;

const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

// Validate required environment variables
if (!DEFAULT_ADMIN.email || !DEFAULT_ADMIN.password) {
  throw new Error('Admin email and password must be set in environment variables');
}

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return Promise.resolve(null);
};

const adminOptions = {
  resources: [AboutUs, contactResourceOptions, eventResourceOptions, announcementResourceOptions,initiativesResourceOptions, Facilities, TeamMember, clubMain, homepage],
  rootPath: ADMINPANELROOT,
  loginPath: ADMINPANELROOT + "/login",
  logoutPath: ADMINPANELROOT + "/logout",
  branding: {
    companyName: 'Cultural Board Admin',
    logo: false,
    withMadeWithLove: false,
    theme: {
      colors: {
        primary100: '#4F46E5',
        primary80: '#6366F1',
        primary60: '#818CF8',
        primary40: '#A5B4FC',
        primary20: '#C7D2FE',
      }
    }
  },
  locale: {
    language: 'en',
    translations: {
      messages: {
        loginWelcome: 'Cultural Board Administration' // Custom login message
      }
    }
  }
};

const admin = new AdminJS(adminOptions);

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin,
  {
    authenticate,
    cookieName: process.env.COOKIE_NAME || 'adminjs',
    cookiePassword: process.env.COOKIE_PASSWORD || 'secret-password',
  },
  null, // pre-defined router
  {
    resave: true,
    saveUninitialized: true,
    secret: process.env.COOKIE_PASSWORD || 'secret-password',
    cookie: {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
    }
  }
);
try {
  admin.watch();
} catch (err) {
  console.log(err);
}

export { admin, adminRouter };

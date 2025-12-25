import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { Request } from "express";

import { config } from "./app.config";

// Passport strategies will be configured in Phase 3 (Auth System)
// For now, just basic serialization

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

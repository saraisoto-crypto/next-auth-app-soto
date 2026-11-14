import { Schema, model, models, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // hash generado con bcrypt
    failedAttempts: { type: Number, default: 0 }, // intentos fallidos seguidos
    lockUntil: { type: Date, default: null }, // fecha hasta la que la cuenta está bloqueada
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof UserSchema>;

export const User = models.User || model("User", UserSchema);
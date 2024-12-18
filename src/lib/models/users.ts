import {
  getModelForClass,
  index,
  ModelOptions,
  mongoose,
  prop,
  Severity,
} from "@typegoose/typegoose";

@index({ title: 1 })
@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "users",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class UsersClass {
  _id!: mongoose.Types.ObjectId;
  @prop({ required: [true, "Name is required"], unique: true })
  name?: string;
  @prop({ required: [true, "Surname is required"] })
  surname?: string;
  @prop({
    required: [true, "ID is required"],
    unique: true,
    match: [/^[A-Za-z]{2}[0-9]{6}$/, "ID number is invalid!"],
  })
  IDnumber?: string;
  @prop({ required: false })
  userPassword?: string;
  @prop({
    required: [false, "Email is required"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Email is invalid",
    ],
  })
  userEmail?: string;
  @prop({ required: [true, "Date of birth is required"] })
  dateOfBirth?: Date;
}

const Users = getModelForClass(UsersClass);

export { Users, UsersClass };

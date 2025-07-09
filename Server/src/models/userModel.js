class UserModel {
  constructor({
    id,
    email,
    displayName = "",
    avatarUrl = "",
    phoneNumber = "",
    role = "user",
    status = "active",
    createdAt = new Date(),
    lastLogin = new Date(),
  }) {
    this.id = id;
    this.email = email;
    this.displayName = displayName;
    this.avatarUrl = avatarUrl;
    this.phoneNumber = phoneNumber;
    this.role = role;
    this.status = status;
    this.createdAt = createdAt;
    this.lastLogin = lastLogin;
  }
}

module.exports = UserModel;

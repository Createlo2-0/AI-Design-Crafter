class UserModel {
  constructor({
    id,
    email,
    displayName = "",
    role = "user",
    avatarUrl = "",
    status = "active",
    createdAt = new Date(),
    lastLogin = new Date(),
  }) {
    this.id = id;
    this.email = email;
    this.displayName = displayName;
    this.role = role; // "user" or "admin"
    this.avatarUrl = avatarUrl;
    this.status = status; // "active" or "inactive"
    this.createdAt = createdAt;
    this.lastLogin = lastLogin;
  }
}

module.exports = UserModel;

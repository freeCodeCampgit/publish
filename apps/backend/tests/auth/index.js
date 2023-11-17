"use strict";
const request = require("supertest");
const { getUser, getUserJWT, deleteUser } = require("../helpers/helpers");

// user mock data
const mockUserData = {
  username: "tester",
  email: "tester@strapi.com",
  provider: "local",
  password: "1234abc",
  confirmed: true,
  blocked: null,
};

describe("auth", () => {
  describe("invitation", () => {
    let sendEmailSpy;

    beforeEach(() => {
      sendEmailSpy = jest
        .spyOn(strapi.plugins.email.services.email, "send")
        .mockImplementation(jest.fn());
    });

    afterEach(() => {
      deleteUser(mockUserData.username);
      jest.clearAllMocks();
    });

    it("should set the user's provider to auth0 and delete the password", async () => {
      await strapi.plugins["users-permissions"].services.user.add({
        ...mockUserData,
      });
      // There are subtle differences between what services.user.add and
      // getUser return, so we use getUser for a fair comparison.
      const user = await getUser(mockUserData.username);
      // TODO: only allow admin
      const editorToken = await getUserJWT("editor-user");

      const res = await request(strapi.server.httpServer)
        .put("/api/auth/invitation/" + user.id)
        .auth(editorToken, { type: "bearer" });

      expect(res.body).toEqual({ status: "success" });
      expect(res.status).toEqual(200);
      const updatedUser = await getUser(user.username);
      expect(updatedUser).toEqual({
        ...user,
        provider: "auth0",
        updatedAt: updatedUser.updatedAt,
        password: null,
      });
    });

    it("should email the invited user", async () => {
      const { id } =
        await strapi.plugins["users-permissions"].services.user.add(
          mockUserData,
        );
      // TODO: only allow admin
      const editorToken = await getUserJWT("editor-user");

      const res = await request(strapi.server.httpServer)
        .put("/api/auth/invitation/" + id)
        .auth(editorToken, { type: "bearer" });

      expect(res.body).toEqual({ status: "success" });
      expect(res.status).toEqual(200);
      expect(sendEmailSpy).toHaveBeenCalledTimes(1);
      expect(sendEmailSpy).toHaveBeenCalledWith({
        to: mockUserData.email,
        from: "support@freecodecamp.org",
        subject: "Invitation Link",
        text: `Here is your invitation link: http://localhost:3000/api/auth/signin`,
      });
    });

    // This should happen irrespective of what we do with their password. i.e.
    // we null it, but even if we didn't they should not be able to login.
    it("should prevent email password login", async () => {
      const { id } =
        await strapi.plugins["users-permissions"].services.user.add(
          mockUserData,
        );

      const loginResponse = await request(strapi.server.httpServer)
        .post("/api/auth/local")
        .send({
          identifier: mockUserData.email,
          password: mockUserData.password,
        });
      expect(loginResponse.status).toEqual(200);

      // TODO: only allow admin
      const editorToken = await getUserJWT("editor-user");

      await request(strapi.server.httpServer)
        .put("/api/auth/invitation/" + id)
        .auth(editorToken, { type: "bearer" });

      const deniedLoginResponse = await request(strapi.server.httpServer)
        .post("/api/auth/local")
        .send({
          identifier: mockUserData.email,
          password: mockUserData.password,
        });

      expect(deniedLoginResponse.body.error.message).toEqual(
        "Invalid identifier or password",
      );
      expect(deniedLoginResponse.status).toEqual(400);
    });
  });
});

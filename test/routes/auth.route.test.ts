import { getRequest, truncate } from "../utils";
import factory from "../utils/factory";
import { getUser } from "../../app/services/user.service";

describe("Auth route", () => {
  const request = getRequest();

  beforeEach(async () => {
    return truncate("users");
  });

  afterEach(async () => {
    return truncate("users");
  });

  describe("POST /auth/check_user", () => {
    it("[AUTH/CHECK_USER] Should return user Exist false", async () => {
      await request
        .post("/api/v1/auth/check_user")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: "noname@gmail.com",
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.isUserExist).toBe(false);
        });
    });

    it("[AUTH/CHECK_USER] Should get status 200", async () => {
      const user = await factory.create("User");
      await request
        .post("/api/v1/auth/check_user")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: user.email,
        })
        .expect(200);
    });

    it("[AUTH/CHECK_USER] Should get status 400", async () => {
      await request
        .post("/api/v1/auth/check_user")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: "",
        })
        .expect(400);
    });
  });

  describe("POST /auth/login", () => {
    it("[AUTH/LOGIN] Should get status 200", async () => {
      const user = await factory.create("User");

      await request
        .post("/api/v1/auth/login")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: user.email,
          password: "Test123456",
        })
        .expect(200);
    });

    it("[AUTH/LOGIN] Should return 400 (payload without password)", async () => {
      await request
        .post("/api/v1/auth/login")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: "denis+test@ninetwothree.co",
        })
        .expect(400);
    });

    it("[AUTH/LOGIN] Should return 401 (The user does not exist in system)", async () => {
      await request
        .post("/api/v1/auth/login")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: "denis+test@ninetwothree.co",
          password: "test1234",
        })
        .expect(401);
    });
  });

  describe("POST /auth/registration", () => {
    it("[AUTH/REGISTRATION] Should return 400 (wrong payload)", async () => {
      await request
        .post("/api/v1/auth/registration")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: "denis+test@ninetwothree.co",
        })
        .expect(400);
    });

    it("[AUTH/REGISTRATION] Should return 422 User already exists", async () => {
      const user = await factory.create("User");
      await request
        .post("/api/v1/auth/registration")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          password: "test1234",
          password_confirm: "test1234",
          phone: "",
          photo: "",
        })
        .expect(422);
    });

    it("[AUTH/REGISTRATION] Should return 200. User created.", async () => {
      await request
        .post("/api/v1/auth/registration")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: "denis+test@ninetwothree.co",
          first_name: "denis",
          last_name: "stetskov",
          password: "test1234",
          password_confirm: "test1234",
          phone: "",
          photo: "",
        })
        .expect(200);
    });
  });

  describe("POST /auth/verify_email", () => {
    it("[AUTH/ACTIVATE_ACCOUNT] Should return 400 (wrong payload)", async () => {
      await request
        .post("/api/v1/auth/verify_email")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: "denis+test@ninetwothree.co",
        })
        .expect(400);
    });

    it("[AUTH/ACTIVATE_ACCOUNT] Should return 404.Pin not found", async () => {
      const user = await factory.create("User");
      await request
        .post("/api/v1/auth/verify_email")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: user.email,
          confirmation_hash: "1234",
        })
        .expect(404);
    });

    it("[AUTH/ACTIVATE_ACCOUNT] Should return 200. User activated.", async () => {
      const user = await factory.create("User");

      await request
        .post("/api/v1/auth/verify_email")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: user.email,
          confirmation_hash: "1111",
        })
        .expect(200);
    });
  });

  describe("POST /auth/forgot_password", () => {
    it("[AUTH/FORGOT PASSWORD] Should get status 404", async () => {
      await request
        .post("/api/v1/auth/forgot-password")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: "denis+test@ninetwothree.co",
        })
        .expect(404);
    });

    it("[AUTH/FORGOT PASSWORD] Should get status 200", async () => {
      await request
        .post("/api/v1/auth/registration")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: "denis+test@ninetwothree.co",
          first_name: "denis",
          last_name: "stetskov",
          password: "test1234",
          password_confirm: "test1234",
          phone: "",
          photo: "",
        })
        .expect(200);
      await request
        .post("/api/v1/auth/forgot_password")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: "denis+test@ninetwothree.co",
        })
        .expect(200);
    });
  });

  describe("POST /auth/reset_password", () => {
    it("[AUTH/SET PASSWORD] Should get status 200", async () => {
      await request
        .post("/api/v1/auth/registration")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: "denis+test@ninetwothree.co",
          first_name: "denis",
          last_name: "stetskov",
          password: "test1234",
          password_confirm: "test1234",
          phone: "",
          photo: "",
        })
        .expect(200);

      await request
        .post("/api/v1/auth/forgot_password")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: "denis+test@ninetwothree.co",
        })
        .expect(200);

      const user = await getUser({ email: "denis+test@ninetwothree.co" });

      await request
        .post("/api/v1/auth/reset_password")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          hash: user.confirmation_hash,
          password: "Test889988",
          password_confirm: "Test889988",
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.token).toBeTruthy();
        });
    });

    it("[AUTH/SET PASSWORD] Should return 400 - (Wrong payload)", async () => {
      await request
        .post("/api/v1/auth/reset_password")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          hash: "TEST_HASH",
          password: "Test889988",
        })
        .expect(400);
    });

    it("[AUTH/SET PASSWORD] Should return 404 - (User hash is invalid or has expired)", async () => {
      await request
        .post("/api/v1/auth/reset_password")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          hash: "TEST_HASH",
          password: "Test889988",
          password_confirm: "Test889988",
        })
        .expect(404);
    });
  });

  describe("POST /auth/social_login", () => {
    it("[AUTH/SOCIAL_LOGIN] Should get status 200. First login with social", async () => {
      await request
        .post("/api/v1/auth/social_login")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          first_name: "Denis",
          last_name: "Stetskov",
          email: "denis+test@ninetwothree.co",
          photo: "",
          provider: "facebook",
          social_id: "1033820912267852824922",
        })
        .expect(200);
    });

    it("[AUTH/SOCIAL_LOGIN] Should return 400 - (Wrong payload)", async () => {
      await request
        .post("/api/v1/auth/social_login")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          first_name: "Denis",
          last_name: "Stetskov",
          email: "denis+test@ninetwothree.co",
        })
        .expect(400);
    });

    it("[AUTH/SOCIAL_LOGIN] Should return 200. Assign social login to user.", async () => {
      await request
        .post("/api/v1/auth/registration")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: "denis+test@ninetwothree.co",
          first_name: "denis",
          last_name: "stetskov",
          password: "test1234",
          password_confirm: "test1234",
          photo: "",
          phone: "",
        })
        .expect(200);
      await request
        .post("/api/v1/auth/social_login")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          first_name: "Denis",
          last_name: "Stetskov",
          email: "denis+test@ninetwothree.co",

          photo: "",
          provider: "facebook",
          social_id: "1033820912267852824922",
        })
        .expect(200);
    });
  });

  describe("POST /auth/resend_email", () => {
    it("[AUTH/RESEND_EMAIL] Should return 404", async () => {
      await request
        .post("/api/v1/auth/resend_email")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: "noname@gmail.com",
        })
        .expect(404);
    });

    it("[AUTH/RESEND_EMAIL] Should return 200", async () => {
      const user = await factory.create("User");
      await request
        .post("/api/v1/auth/resend_email")
        .set("Accept", "application/json")
        .set("origin", "localhost")
        .send({
          email: user.email,
        })
        .expect(200);
    });
  });
});

import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import ButtonLoading from "../../components/UI/Loading";
import Modal from "../../components/UI/Modal";
import Input from "../../components/UI/Input";

import api from "../../services/api/index.js";
import useAuth from "../../hooks/useAuth";
import useMeta from "../../hooks/useMeta/index.tsx";
import useComponentVisible from "../../hooks/useComponentVisible/index.tsx";

import "react-slideshow-image/dist/styles.css";

const Login = () => {
  useMeta({ title: "BetterWASYA | Авторизация" });
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { isComponentVisible: showAuth, setIsComponentVisible: setShowAuth, ref } = useComponentVisible();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  const [token, setToken] = useState("");

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      setIsLoadingLogin(true);
      const { data: loginData } = await api.auth.checkToken({ token: token });

      auth.setToken(loginData.token);
      auth.setUser(loginData.user);

      global.gtag("event", "signin_auth_token", { wasd_user_id: loginData.user.user_id, user_login: loginData.user.user_login });
    } catch (e) {
      if (e.message.match("404") || e.message.match("401")) {
        setError("Возможно, недействительный токен или ошибка с нашей стороны :(");
      } else {
        const redirect = searchParams.get("redirect");
        if (redirect) {
          navigate(redirect);
        } else {
          navigate("/");
        }
      }
    } finally {
      setIsLoading(false);
      setIsLoadingLogin(false);
    }
  };

  const inputChange = (e) => {
    setToken(e.target.value);
    setError(null);
  };

  return (
    <>
      <section className="main-section">
        <div className="block">
          <div className="main-title">Авторизация</div>
          {searchParams.get("redirect") && (
            <div className="descr" style={{ maxWidth: "none" }}>
              Для перехода в раздел «{window.location.origin}
              {searchParams.get("redirect")}» нужна авторизация.
            </div>
          )}
          <div className="descr">На данный момент мы можем вас авторизовать только через API токен.</div>
          <div className="buttons">
            <button className="button-big white" onClick={() => setShowAuth(true)}>
              Продолжить
            </button>
          </div>
        </div>
      </section>

      <Modal isShow={showAuth} visibleRef={ref}>
        <span> Авторизация </span>
        <>
          <label>Мы храним токен на вашем устройстве, не показывайте его третьему лицу!</label>
          <br />
          <br />
          <label>
            Где найти токен?
            <a style={{ marginLeft: "5px" }} href="https://wasd.tv/general-settings/API" target="_blank" rel="noreferrer">
              Токен API
            </a>
          </label>
          <Input
            autoFocus
            placeholder="Ваш токен"
            style={{ flexDirection: "column", alignItems: "stretch" }}
            inputClassName={`blur ${isLoading ? "disabled" : ""}`}
            value={token}
            onChange={inputChange}
            onKeyDown={(e) => e.code === "Enter" && onSubmit()}
          />
          {error && (
            <span className="error" style={{ marginTop: "5px" }}>
              {error}
            </span>
          )}
          <br />
          <label style={{ fontSize: "13px" }}>*Сгенерируйте новый токен а после чего вставьте в поле выше*</label>
          <br />
          <br />
        </>
        <div className="flat-btn" style={{ display: "flex" }}>
          <button className={`medium basic ${isLoading ? "disabled" : ""}`} style={{ marginRight: "5px" }} onClick={() => setShowAuth(false)}>
            отмена
          </button>
          <button className={`primary medium updateUser ${isLoading ? "disabled" : ""}`} disabled={isLoadingLogin} style={{ width: "109px" }} onClick={onSubmit}>
            {isLoadingLogin ? <ButtonLoading /> : "проверить"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTitle from "../../../hooks/useTitle";
import { decode } from "../../../lib/code-mnem";
import { Link } from "react-router-dom";
import Moment from "react-moment";

import User from "../../../components/UI/User";
import ButtonLoading from "../../../components/UI/Loading";

import NotFound from "../../NotFound";
import { HOSTURL } from "../../../index";
import api from "../../../services/api";
import useAuth from "../../../hooks/useAuth";

import classnames from "classnames";

const Emote = () => {
  const { id } = useParams();
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const [isChangeMode, setIsChangeMode] = useState(false);

  const [newData, setNewData] = useState(null);
  const [codeError, setCodeError] = useState("");

  const codeHandler = (e) => {
    setNewData({ ...newData, code: e.target.value });
    const re = /[^а-яА-Яa-zA-Z0-9]+/g;
    if (re.test(String(e.target.value).toLowerCase())) {
      setCodeError("Ошибка валидации");
    } else {
      if (String(e.target.value).length === 0) {
        setCodeError("Код эмоции не может быть пустым");
      } else if (String(e.target.value).length < 3) {
        setCodeError("Количество сомволов не может быть меньше 3");
      } else if (String(e.target.value).length > 240) {
        setCodeError("Количество сомволов не может быть болоьще 240");
      } else {
        setCodeError("");
      }
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: res } = await api.emote.getEmoteById(
          id,
          auth.editor?.user_id
        );
        setData(res);
        setNewData(res);
      } catch (e) {
        console.log(e);
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    setIsChangeMode(false);
    document.querySelector(".wrapper")?.scrollTo({ top: 0, left: 0 });
  }, [id, auth.editor?.user_id]);

  const encoded = decode(data?.code);
  useTitle(`BetterWASD | Emote ${data?.code ? "| " + encoded : ""}`, [data]);

  if (error) return <NotFound />;

  let column = [
    {
      marginRight: "10px",
      justifyContent: "flex-start",
    },
    {
      marginLeft: "10px",
    },
    {
      display: "flex",
      justifyContent: "center",
    },
    {
      width: "100%",
    },
    {
      display: "flex",
      justifyContent: "space-evenly",
      paddingTop: "5px",
    },
    {
      maxWidth: "40%",
    },
  ];

  const onUpdate = async () => {
    setIsLoadingUpdate(true);
    const { data: nData } = await api.emote.updateEmote(
      data._id,
      {
        code: newData.code,
        message: newData.message,
        sharing: newData.sharing,
        visibility_simple: newData.visibility_simple,
        global: newData.global,
      },
      auth.editor?.user_id
    );
    setData(nData);
    setNewData(nData);
    setIsLoadingUpdate(false);
  };

  const onDelete = async () => {
    setIsLoadingRemove(true);
    const { data: nData } = await api.emote.deleteEmote(
      data._id,
      auth.editor?.user_id
    );
    if (nData.ok) {
      setData(null);
      setNewData(null);
      navigate("/dashboard/emotes");
    }
    setIsLoadingRemove(false);
  };

  const likeEmote = async () => {
    setIsLoadingLike(true);
    if (data.likes.is_liked) {
      const { data: nData } = await api.emote.unlikeEmote(
        data._id,
        auth.editor?.user_id
      );
      if (nData) setData({ ...data, likes: { ...nData } });
    } else {
      const { data: nData } = await api.emote.likeEmote(
        data._id,
        auth.editor?.user_id
      );
      if (nData) setData({ ...data, likes: { ...nData } });
    }
    setIsLoadingLike(false);
  };

  const isOwner = auth.editor
    ? typeof data?.user?.user_id !== "undefined" &&
      data?.user?.user_id === auth.editor?.user_id
    : typeof data?.user?.user_id !== "undefined" &&
      data?.user?.user_id === auth.user?.user_id;
  // const is = isOwner || auth.user?.user_role === "ADMIN";

  if (!data) return null;

  if (isLoading) {
    return (
      <div className="item item__rigtt" style={{ width: "100%" }}>
        <div className="card block skelet-loading" style={column[3]}>
          <div className="card-header d-flex">
            <div
              style={{ width: "150px", height: "18px", marginRight: "50px" }}
              className="loading"
            ></div>
            <div
              style={{ width: "180px", height: "18px" }}
              className="loading"
            ></div>
          </div>
          <div className="card-body" style={{ minHeight: "180px" }}>
            <div
              className="card-body"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "140px",
                minHeight: "140px",
              }}
            >
              <img
                style={column[5]}
                width={28}
                height={28}
                src="data:image/gif;base64,R0lGODlhAQABAPcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAABAAEAAAgEAP8FBAA7"
                alt="1x"
                className="loading"
              />
              <img
                style={column[5]}
                width={56}
                height={56}
                src="data:image/gif;base64,R0lGODlhAQABAPcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAABAAEAAAgEAP8FBAA7"
                alt="2x"
                className="loading"
              />
              <img
                style={column[5]}
                width={112}
                height={112}
                src="data:image/gif;base64,R0lGODlhAQABAPcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAABAAEAAAgEAP8FBAA7"
                alt="3x"
                className="loading"
              />
            </div>
            <div
              className="date loading"
              style={{ width: "150px", height: "14px" }}
            ></div>
          </div>
          {auth.user ? (
            <div className="card-footer">
              <div className="flat-btn ovg" style={{ display: "flex" }}>
                <div
                  style={{ width: "165px", height: "32px" }}
                  className="loading"
                ></div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="card block skelet-loading" style={column[3]}>
          <div className="card-header d-flex">
            <div
              style={{ width: "100px", height: "18px" }}
              className="loading"
            ></div>
          </div>
          <div className="card-body">
            <div className="emotes">
              {Array(10)
                .fill({})
                .map((user, index) => (
                  <User
                    key={user.user_id || index}
                    user={user}
                    loading={isLoading}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="item item__rigtt" style={{ width: "100%" }}>
      {!isChangeMode && (
        <div className="card block" style={column[3]}>
          <div className="card-header d-flex">
            <div
              style={{
                textTransform: "none",
                wordBreak: "break-all",
                marginRight: "50px",
              }}
            >
              {encoded}
            </div>
            <div className="emote-state">
              {!data.sharing && (
                <div className="private-emote">ПРИВАТНАЯ ЭМОЦИЯ</div>
              )}
              {!!data.visibility_simple?.filter((t) => t === "ZERO_WIDTH")
                .length && <div className="zero-width">ZERO-WIDTH</div>}
            </div>
            {data.global !== false ? (
              <div>Глобальная эмоция</div>
            ) : (
              <div
                style={{ display: "flex", alignItems: "center" }}
                className="user_login"
              >
                автор
                <img
                  style={{
                    height: "14px",
                    margin: "0 5px",
                    borderRadius: "25px",
                  }}
                  src={data.user.channel_image}
                  alt="ava"
                />
                <Link to={"/users/" + data.user.user_id}>
                  {data.user.user_login}
                </Link>
              </div>
            )}
          </div>
          <div className="card-body" style={{ minHeight: "180px" }}>
            <div
              className="card-body"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "140px",
                minHeight: "140px",
              }}
            >
              <img
                style={column[5]}
                src={HOSTURL + "/cached/emote/" + data._id + "/1x"}
                alt="1x"
              />
              <img
                style={column[5]}
                src={HOSTURL + "/cached/emote/" + data._id + "/2x"}
                alt="2x"
              />
              <img
                style={column[5]}
                src={HOSTURL + "/cached/emote/" + data._id + "/3x"}
                alt="3x"
              />
            </div>
            <Moment
              className="date"
              date={new Date(data.createdAt)}
              format="Создано DD.MM.YYYY, HH:mm"
            />
          </div>
          {data.global === false &&
          !isOwner &&
          auth.user &&
          (data.sharing || auth.user?.user_role !== "ADMIN") ? (
            <div className="card-footer flat-btn ovg">
              {auth.user?.user_role === "ADMIN" && (
                <button
                  onClick={() => setIsChangeMode(true)}
                  style={{ width: "167px" }}
                  className={classnames("medium", "ovg", "primary")}
                >
                  Изменить эмоцию
                </button>
              )}
              {data.sharing && (
                <button
                  onClick={likeEmote}
                  style={{ marginLeft: "5px", width: "167px" }}
                  disabled={isLoadingLike}
                  className={classnames(
                    "medium",
                    "ovg",
                    data.likes.is_liked ? "warning" : "primary"
                  )}
                >
                  {isLoadingLike ? (
                    <ButtonLoading />
                  ) : data.likes.is_liked ? (
                    "Удалить из канала"
                  ) : (
                    "Добавить на канал"
                  )}
                </button>
              )}
            </div>
          ) : (
            isOwner && (
              <div className="card-footer flat-btn ovg">
                <button
                  onClick={() => setIsChangeMode(true)}
                  style={{ width: "167px" }}
                  className={classnames("medium", "ovg", "primary")}
                >
                  Изменить эмоцию
                </button>
              </div>
            )
          )}
        </div>
      )}
      {data?.likes?.total !== 0 && !isChangeMode ? (
        <div className="card block" style={column[3]}>
          <div className="card-header d-flex">
            <div style={{ textTransform: "none" }}>
              Каналы ({data?.likes?.total})
            </div>
          </div>
          <div className="card-body" style={{ minHeight: "150px" }}>
            <div className="emotes">
              {data && data.likes && data.likes.users
                ? data.likes.users.map((user) => (
                    <User key={user.user_id} user={user} />
                  ))
                : null}
            </div>
          </div>
        </div>
      ) : null}
      {isChangeMode ? (
        <div className="card block" style={column[3]}>
          <div className="card-header d-flex">
            <div
              style={{
                textTransform: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              Настройка
              <img
                style={{
                  height: "25px",
                  marginLeft: "85px",
                  position: "absolute",
                }}
                src={HOSTURL + "/cached/emote/" + data._id + "/1x"}
                alt="emote"
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "center" }}
              className="user_login"
            >
              автор
              <img
                style={{
                  height: "14px",
                  margin: "0 5px",
                  borderRadius: "25px",
                }}
                src={data.user.channel_image}
                alt="ava"
              />
              <Link to={"/users/" + data.user.user_id}>
                {data.user.user_login}
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div>
              <span>Код эмоции</span>
              {codeError && (
                <span className="error" style={{ paddingLeft: "5px" }}>
                  {codeError}
                </span>
              )}
            </div>

            <wasd-input>
              <div ovg="" className="wasd-input-wrapper">
                <div
                  ovg=""
                  className={classnames("wasd-input", codeError && "warning")}
                >
                  <input
                    data-type="code"
                    value={newData.code || ""}
                    onChange={(e) => codeHandler(e)}
                    ovg=""
                    placeholder="Код эмоции"
                    type="text"
                  />
                </div>
              </div>
            </wasd-input>

            <p
              style={{
                paddingTop: "5px",
                color: "var(--wasd-color-text-third)",
              }}
            >
              Коды эмоций могут быть буквами и цифрами. Не менее 3 символов.
            </p>

            <div>Примечания об утверждении</div>

            <wasd-input>
              <div ovg="" className="wasd-input-wrapper">
                <div ovg="" className="wasd-input">
                  <textarea
                    value={newData.message || ""}
                    onChange={(e) =>
                      setNewData({ ...newData, message: e.target.value })
                    }
                    style={{
                      height: "100px",
                      maxHeight: "200px",
                      minHeight: "40px",
                    }}
                    ovg=""
                    placeholder=""
                    type="text"
                  ></textarea>
                </div>
              </div>
            </wasd-input>

            <p
              style={{
                paddingTop: "5px",
                color: "var(--wasd-color-text-third)",
              }}
            >
              Если ваша эмоция будет решена для проверки вручную (либо
              автоматически, либо кем-то, кто сообщил об этом), пожалуйста,
              объясните эту эмоцию и предоставьте обоснование для использования.
            </p>

            <div className="hover-pointer">
              <input
                id="sharing"
                type="checkbox"
                checked={newData.sharing || false}
                onChange={(e) =>
                  setNewData({ ...newData, sharing: e.target.checked })
                }
              />
              <label htmlFor="sharing" style={{ marginLeft: "5px" }}>
                Совместное использование
              </label>
            </div>

            <p
              style={{
                paddingTop: "5px",
                color: "var(--wasd-color-text-third)",
              }}
            >
              Включение общего доступа позволяет другим пользователям добавлять
              эту эмоцию в свой чат WASD.TV.
            </p>

            {auth.user?.user_role === "ADMIN" && (
              <div className="hover-pointer">
                <input
                  id="zero_width"
                  type="checkbox"
                  checked={
                    !!newData.visibility_simple.filter(
                      (t) => t === "ZERO_WIDTH"
                    ).length
                  }
                  onChange={(e) =>
                    setNewData({
                      ...newData,
                      visibility_simple: e.target.checked ? ["ZERO_WIDTH"] : [],
                    })
                  }
                />
                <label htmlFor="zero_width" style={{ marginLeft: "5px" }}>
                  Эмоция нулевой ширины
                </label>
              </div>
            )}

            {auth.user?.user_role === "ADMIN" && <br></br>}

            {auth.user?.user_role === "ADMIN" && (
              <div className="hover-pointer">
                <input
                  id="global"
                  type="checkbox"
                  checked={newData.global || false}
                  onChange={(e) =>
                    setNewData({ ...newData, global: e.target.checked })
                  }
                />
                <label htmlFor="global" style={{ marginLeft: "5px" }}>
                  Глобальная эмоция
                </label>
              </div>
            )}
          </div>
          <div className="card-footer flat-btn ovg" style={{ display: "flex" }}>
            <button
              onClick={() => setIsChangeMode(false)}
              className="primary medium ovg"
              style={{ width: "164px" }}
            >
              Обратно к эмоции
            </button>
            <button
              onClick={onUpdate}
              disabled={
                isLoadingUpdate ||
                codeError ||
                !(
                  data.code !== newData.code ||
                  data.global !== newData.global ||
                  data.sharing !== newData.sharing ||
                  !!data.visibility_simple?.filter((t) => t === "ZERO_WIDTH")
                    .length !==
                    !!newData.visibility_simple?.filter(
                      (t) => t === "ZERO_WIDTH"
                    ).length ||
                  data.message !== newData.message
                )
              }
              className="primary medium ovg"
              style={{ marginLeft: "5px", width: "166px" }}
            >
              {isLoadingUpdate ? <ButtonLoading /> : "Обновить эмоцию"}
            </button>
            <button
              onClick={onDelete}
              disabled={isLoadingRemove}
              className="warning medium ovg"
              style={{ marginLeft: "5px", width: "164px" }}
            >
              {isLoadingRemove ? <ButtonLoading /> : "Удалить эмоцию"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Emote;

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Loading from "../../../components/UI/Loading/Line";
import Emote from "../../../components/UI/Emote";
import Pagination from "../../../components/UI/Pagination";

import useMeta from "../../../hooks/useMeta/index.tsx";
import api from "../../../services/api/index.js";
import Search from "../../../components/UI/Search";

const EmotesGlobal = () => {
  useMeta({ title: "BetterWASYA | Глобальные эмоции" });

  const [isLoading, setIsLoading] = useState(true);
  const [isFirsLoading, setIsFirsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(Array(23).fill({}));

  const [searchParams] = useSearchParams();
  const limit = 30 * 2;

  const [page, setPage] = useState(searchParams.get("page") ? Number(searchParams.get("page")) : 1);
  const [total, setTotal] = useState(19);

  const [search, setSearch] = useState(searchParams.get("query") ? searchParams.get("query") : "");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetch = async () => {
        try {
          setIsLoading(true);
          const { data: res, headers } = await api.emote.getGlobalEmotes(limit, (page - 1) * limit, search.trim());
          setTotal(headers.total);
          setData(res);
        } catch (e) {
          setError(e);
        } finally {
          setIsLoading(false);
          setIsFirsLoading(false);
          setError(null);
        }
      };
      fetch();
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [page, search, limit]);

  return (
    <div className="item block item_right" style={{ marginTop: "0px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {search === "" && <div className="item__title"> Глобальные эмоции </div>}
        {search !== "" && <div className="item__title"> Глобальные эмоции: {search} </div>}
        <Search
          value={search}
          onChange={(e) => {
            setSearch(e.target.value.replace(/[^а-яА-Яa-zA-Z0-9]+/g, ""));
            setPage(1);
          }}
        />
      </div>
      <div className="item__descr">Эмоции, которые можно использовать во всех чатах на WASD.TV с BetterWASYA.</div>
      <div className="item__border" />
      <div className="emotes">
        {error && error.message}
        {isLoading && !isFirsLoading && <Loading />}
        {data.length !== 0 && data.map((emote, index) => <Emote key={emote._id || index} emote={emote} loading={isFirsLoading} />)}
        {data.length === 0 && search !== "" && <div>Здесь нет ничего</div>}
      </div>
      <Pagination page={page} total={total} search={search} limit={limit} setPage={setPage} />
    </div>
  );
};

export default EmotesGlobal;

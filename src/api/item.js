import axios from "axios";

const request = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// 统一拆包：后端返回 { code, msg, data }
request.interceptors.response.use(
  (res) => {
    const body = res.data;
    if (body.code !== 0) {
      return Promise.reject(new Error(body.msg || "请求失败"));
    }
    return body.data;
  },
  (err) => Promise.reject(new Error(err.message || "网络异常")),
);

/** 分页 + 关键词 + 状态查询 */
export function getItems(params) {
  return request.get("/items", { params });
}

export function getItem(id) {
  return request.get(`/items/${id}`);
}

export function createItem(data) {
  return request.post("/items", data);
}

export function updateItem(id, data) {
  return request.put(`/items/${id}`, data);
}

export function markSold(id) {
  return request.post(`/items/${id}/sold`);
}

export function deleteItem(id) {
  return request.delete(`/items/${id}`);
}

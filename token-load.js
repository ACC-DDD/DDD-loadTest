import http from "k6/http";
import {check} from "k6";

const BASE_URL = "https://sk0ldkamg3.execute-api.ap-northeast-2.amazonaws.com/index-token-db";

export const options = {
  scenarios: {
    load_test: {
      executor: "constant-vus", // 일정하게 가상 사용자(VUs)를 유지
      vus: 50, // 50명의 사용자가
      duration: "5m", // 5분 동안 테스트를 진행
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<1000"], // 95%의 요청이 1초 안에 응답해야 함
    http_req_failed: ["rate<0.01"], // 실패율이 1% 미만이어야 함
  },
};

export default function () {
  const payload = JSON.stringify({
    token: `dmmNgOc_v8hxQ7suxK7w48:APA91bGboD-zpHdrFYzhsPX6DbKz73HdbnWCoS9CyqlacAKBE46QmrNl3lV2aHyEqigaOtXGSheypFHeoo9JrZ3OMEAhJViqttbkVF8q5wu_-VqQeHDEo8Y`,
    topic: "all",
  });
  const params = {
    headers: {"Content-Type": "application/json"},
  };

  const res = http.post(BASE_URL, payload, params);

  check(res, {
    "status is 200 or 202": (r) => r.status === 200 || r.status === 202,
  });
}

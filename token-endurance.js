import http from "k6/http";
import {check} from "k6";

const BASE_URL = "https://sk0ldkamg3.execute-api.ap-northeast-2.amazonaws.com/index-token-db";

export const options = {
  scenarios: {
    soak_test: {
      executor: "constant-vus",
      vus: 100, // 100명의 가상 사용자를 유지
      duration: "4h", // 4시간 동안 테스트를 진행 (더 길게 설정할 수도 있음)
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.01"],
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
  check(res, {"status is 200 or 202": (r) => r.status === 200 || r.status === 202});
}

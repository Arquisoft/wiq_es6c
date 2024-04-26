
import java.time.Duration;
import java.util.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;
import io.gatling.javaapi.jdbc.*;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;
import static io.gatling.javaapi.jdbc.JdbcDsl.*;

public class RecordedSimulation extends Simulation {

  private HttpProtocolBuilder httpProtocol = http
    .baseUrl("http://20.77.37.219:8000")
    .inferHtmlResources()
    .acceptHeader("application/json, text/plain, */*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0");
  
  private Map<CharSequence, String> headers_0 = Map.ofEntries(
    Map.entry("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"),
    Map.entry("If-None-Match", "\"182633cf2be777a0a40ef586ae3e79d6ed0d412c\""),
    Map.entry("Upgrade-Insecure-Requests", "1")
  );
  
  private Map<CharSequence, String> headers_1 = Map.ofEntries(
    Map.entry("Accept", "*/*"),
    Map.entry("If-None-Match", "\"de6b003f5f55f8eafb5cf99dfdb50b06c256b8ec\"")
  );
  
  private Map<CharSequence, String> headers_2 = Map.ofEntries(
    Map.entry("Accept", "text/css,*/*;q=0.1"),
    Map.entry("If-None-Match", "\"d65f7937a93830fcf64ed12c22e22e84a989280b\"")
  );
  
  private Map<CharSequence, String> headers_3 = Map.ofEntries(
    Map.entry("Accept", "image/avif,image/webp,*/*"),
    Map.entry("If-None-Match", "\"0d821abc44e55cf22437703b516fd812d8985df4\"")
  );
  
  private Map<CharSequence, String> headers_4 = Map.ofEntries(
    Map.entry("Accept", "*/*"),
    Map.entry("Access-Control-Request-Headers", "content-type"),
    Map.entry("Access-Control-Request-Method", "POST"),
    Map.entry("Origin", "http://20.77.37.219:3000")
  );
  
  private Map<CharSequence, String> headers_5 = Map.ofEntries(
    Map.entry("Content-Type", "application/json"),
    Map.entry("Origin", "http://20.77.37.219:3000")
  );
  
  private Map<CharSequence, String> headers_6 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"1a-wZLO0dnansZJtJSyZu1ngyMgrB0\""),
    Map.entry("Origin", "http://20.77.37.219:3000")
  );
  
  private Map<CharSequence, String> headers_7 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"93-DGq751kAS6OqwqT4s4kSukXV1gQ\""),
    Map.entry("Origin", "http://20.77.37.219:3000")
  );
  
  private Map<CharSequence, String> headers_10 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"1a-2SHpqZXaSCbUPXG5HEYl9ykHBWQ\""),
    Map.entry("Origin", "http://20.77.37.219:3000")
  );
  
  private Map<CharSequence, String> headers_11 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"8b-MRYz6Vw+6VwGIgPFvhQD5zJ8krk\""),
    Map.entry("Origin", "http://20.77.37.219:3000")
  );
  
  private Map<CharSequence, String> headers_14 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"bbb-jksFBo9968Fxn3CJiHzaXFB9dcU\""),
    Map.entry("Origin", "http://20.77.37.219:3000")
  );
  
  private Map<CharSequence, String> headers_15 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"d89-prrCLPMkZPtwg8S7w5mCHXF4+Oc\""),
    Map.entry("Origin", "http://20.77.37.219:3000")
  );
  
  private String uri1 = "20.77.37.219";

  private ScenarioBuilder scn = scenario("RecordedSimulation")
    .exec(
      http("request_0")
        .get("http://" + uri1 + ":3000/")
        .headers(headers_0)
        .resources(
          http("request_1")
            .get("http://" + uri1 + ":3000/static/js/main.a8c5620c.js")
            .headers(headers_1),
          http("request_2")
            .get("http://" + uri1 + ":3000/static/css/main.8a900f76.css")
            .headers(headers_2),
          http("request_3")
            .get("http://" + uri1 + ":3000/static/media/background.403e07f4804638d1ff30.png")
            .headers(headers_3)
        ),
      pause(3),
      http("request_4")
        .options("/login")
        .headers(headers_4)
        .resources(
          http("request_5")
            .post("/login")
            .headers(headers_5)
            .body(RawFileBody("recordedsimulation/0005_request.json"))
        ),
      pause(1),
      http("request_6")
        .get("/generateGameUnlimitedQuestions")
        .headers(headers_6)
        .resources(
          http("request_7")
            .get("/gameUnlimitedQuestions")
            .headers(headers_7)
        ),
      pause(4),
      http("request_8")
        .options("/storeGame")
        .headers(headers_4)
        .resources(
          http("request_9")
            .post("/storeGame")
            .headers(headers_5)
            .body(RawFileBody("recordedsimulation/0009_request.json"))
        ),
      pause(2),
      http("request_10")
        .get("/generateGameUnlimitedQuestions")
        .headers(headers_10)
        .resources(
          http("request_11")
            .get("/gameUnlimitedQuestions")
            .headers(headers_11)
        ),
      pause(5),
      http("request_12")
        .options("/storeGame")
        .headers(headers_4)
        .resources(
          http("request_13")
            .post("/storeGame")
            .headers(headers_5)
            .body(RawFileBody("recordedsimulation/0013_request.json"))
        ),
      pause(1),
      http("request_14")
        .get("/history/games/1")
        .headers(headers_14),
      pause(2),
      http("request_15")
        .get("/history/questions")
        .headers(headers_15)
    );

  {
	  setUp(scn.injectOpen(
      rampUsersPerSec(10).to(30).during(60).randomized()
    )).protocols(httpProtocol);
  }
}


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
    .baseUrl("http://20.77.13.201:8000")
    .inferHtmlResources()
    .acceptHeader("application/json, text/plain, */*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0");
  
  private Map<CharSequence, String> headers_0 = Map.ofEntries(
    Map.entry("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"),
    Map.entry("If-None-Match", "\"5fd1dfcdbc11e6074e3e33e4533fcabb3f5885a1\""),
    Map.entry("Upgrade-Insecure-Requests", "1")
  );
  
  private Map<CharSequence, String> headers_1 = Map.ofEntries(
    Map.entry("Accept", "*/*"),
    Map.entry("If-None-Match", "\"199ece5b057d599b281e5c21da9fb8f670f7132e\"")
  );
  
  private Map<CharSequence, String> headers_2 = Map.ofEntries(
    Map.entry("Accept", "text/css,*/*;q=0.1"),
    Map.entry("If-None-Match", "\"d2bf5b0c784247bd6c24d8136c341a71430ecb0c\"")
  );
  
  private Map<CharSequence, String> headers_3 = Map.ofEntries(
    Map.entry("Accept", "image/avif,image/webp,*/*"),
    Map.entry("If-None-Match", "\"0d821abc44e55cf22437703b516fd812d8985df4\"")
  );
  
  private Map<CharSequence, String> headers_4 = Map.ofEntries(
    Map.entry("Accept", "*/*"),
    Map.entry("Access-Control-Request-Headers", "content-type"),
    Map.entry("Access-Control-Request-Method", "POST"),
    Map.entry("Origin", "http://20.77.13.201:3000")
  );
  
  private Map<CharSequence, String> headers_5 = Map.ofEntries(
    Map.entry("Content-Type", "application/json"),
    Map.entry("Origin", "http://20.77.13.201:3000")
  );
  
  private Map<CharSequence, String> headers_6 = Map.of("Origin", "http://20.77.13.201:3000");
  
  private String uri1 = "20.77.13.201";

  private ScenarioBuilder scn = scenario("RecordedSimulation")
    .exec(
      http("request_0")
        .get("http://" + uri1 + ":3000/")
        .headers(headers_0)
        .resources(
          http("request_1")
            .get("http://" + uri1 + ":3000/static/js/main.856355a6.js")
            .headers(headers_1),
          http("request_2")
            .get("http://" + uri1 + ":3000/static/css/main.91ff9419.css")
            .headers(headers_2),
          http("request_3")
            .get("http://" + uri1 + ":3000/static/media/background.403e07f4804638d1ff30.png")
            .headers(headers_3)
        ),
      pause(5),
      http("request_4")
        .options("/login")
        .headers(headers_4)
        .resources(
          http("request_5")
            .post("/login")
            .headers(headers_5)
            .body(RawFileBody("recordedsimulation/0005_request.json"))
        ),
      pause(3),
      http("request_6")
        .get("/topics")
        .headers(headers_6),
      pause(7),
      http("request_7")
        .get("/generateGame")
        .headers(headers_6)
        .resources(
          http("request_8")
            .get("/questions?n_preguntas=3&n_respuestas=3&tema=Capitales")
            .headers(headers_6)
        ),
      pause(7),
      http("request_9")
        .options("/storeGame")
        .headers(headers_4)
        .resources(
          http("request_10")
            .post("/storeGame")
            .headers(headers_5)
            .body(RawFileBody("recordedsimulation/0010_request.json"))
        ),
      pause(2),
      http("request_11")
        .get("http://" + uri1 + ":8100/history/questions")
        .headers(headers_6),
      pause(1),
      http("request_12")
        .get("/history/games/111")
        .headers(headers_6)
    );

  {
	  setUp(
      scn.injectOpen(
        constantUsersPerSec(2).during(60).randomized()
      )
    ).protocols(httpProtocol);
  }
}

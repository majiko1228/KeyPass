package com.keypass.start.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Locale;
import java.util.Set;

/**
 * 记录每个 HTTP 请求的基础访问信息，避免将查询串或凭证类内容写入日志。
 */
@Log4j2
@Component
public class RequestLogFilter extends OncePerRequestFilter {

    private static final Set<String> STATIC_RESOURCE_EXTENSIONS = Set.of(
            ".js", ".css", ".map", ".ico", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif",
            ".woff", ".woff2", ".ttf"
    );

    /**
     * 跳过前端静态资源，避免浏览器加载和缓存命中产生大量无业务价值的访问日志。
     *
     * @param request 当前 HTTP 请求
     * @return 是否跳过本过滤器
     * @throws ServletException 过滤器判断失败时抛出
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String requestPath = request.getRequestURI().toLowerCase(Locale.ROOT);
        return requestPath.contains("/assets/")
                || STATIC_RESOURCE_EXTENSIONS.stream().anyMatch(requestPath::endsWith);
    }

    /**
     * 包装请求处理链，统一记录请求方法、路径、状态码、客户端地址和耗时。
     *
     * @param request 当前 HTTP 请求
     * @param response 当前 HTTP 响应
     * @param filterChain 后续过滤器链
     * @throws ServletException 请求处理失败时抛出
     * @throws IOException IO 处理失败时抛出
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        long startAt = System.currentTimeMillis();
        boolean failed = false;

        try {
            filterChain.doFilter(request, response);
        } catch (ServletException | IOException | RuntimeException ex) {
            failed = true;
            log.error("HTTP {} {} from {} failed in {} ms",
                    request.getMethod(),
                    request.getRequestURI(),
                    clientAddress(request),
                    elapsedMillis(startAt),
                    ex);
            throw ex;
        } finally {
            if (!failed) {
                logCompletedRequest(request, response, startAt);
            }
        }
    }

    private void logCompletedRequest(HttpServletRequest request, HttpServletResponse response, long startAt) {
        int status = response.getStatus();
        String message = "HTTP {} {} from {} completed with status {} in {} ms";
        Object[] args = {
                request.getMethod(),
                request.getRequestURI(),
                clientAddress(request),
                status,
                elapsedMillis(startAt)
        };

        if (status >= HttpServletResponse.SC_INTERNAL_SERVER_ERROR) {
            log.warn(message, args);
            return;
        }

        log.info(message, args);
    }

    private String clientAddress(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private long elapsedMillis(long startAt) {
        return System.currentTimeMillis() - startAt;
    }
}

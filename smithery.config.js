export default {
  esbuild: {
    // 문제가 있는 패키지들을 external로 처리
    external: [
      "@valibot/to-json-schema",
      "sury", 
      "effect",
      "xsschema"
    ],
    // CommonJS 형식으로 출력 (.cjs 파일과 호환)
    format: "cjs",
    // Node.js 타겟 버전
    target: "node18",
    // 프로덕션 최적화
    minify: true,
    // Tree shaking 활성화 (CJS에서도 가능)
    treeShaking: true,
    // Bundle 크기 최적화
    bundle: true,
    // Platform 설정
    platform: "node",
    // import.meta 관련 경고 무시
    logLevel: "warning"
  },
};
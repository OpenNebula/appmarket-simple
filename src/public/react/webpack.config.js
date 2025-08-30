const path = require("path");
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const https = require("https");
const CopyWebpackPlugin = require("copy-webpack-plugin");


// Determine app type (community or opennebula)
const appType = process.env.APP_TYPE || "community";

// Config file alias
const configFile =
  appType === "community"
    ? "config.community.json"
    : "config.opennebula.json";

// API base URL for dev proxy
const pathAPIDevelopmentMode =
  appType === "community"
    ? "https://community-marketplace.opennebula.io"
    : "https://marketplace.opennebula.io";

// Routes to proxy
const proxyRoutes = ["/appliance", "/logos"];

// Keep-alive agent
const keepAliveAgent = new https.Agent({
  keepAlive: true,
  timeout: 30000,
})

// Check dev or prod mode
const isDevelopment = process.env.NODE_ENV !== "production"

const config = {
  mode: isDevelopment ? "development" : "production",
  entry: path.resolve(__dirname, "src/main.jsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
    clean: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@config": path.resolve(__dirname, `src/config/${configFile}`),
    },
    extensions: [".js", ".jsx", ".json", ".mjs"], // add .mjs
    fallback: {
      process: require.resolve("process/browser"),
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,       // <-- fix for .mjs fully specified imports
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-react", { runtime: "automatic" }], // <-- automatic JSX runtime
              "@babel/preset-env"
            ],
            plugins: [
              // Only enable react-refresh in development
              isDevelopment && require.resolve("react-refresh/babel")
            ].filter(Boolean),
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name][ext]",
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
      React: "react",
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      favicon: path.resolve(__dirname, "public/favicon.ico"),
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/assets", to: "assets" }
      ]
    }),    
  ].filter(Boolean),
  devtool: isDevelopment ? "source-map" : false,
  devServer: {
    static: {
      directory: path.resolve(__dirname, "public"),
    },
    port: 3000,
    hot: true,
    historyApiFallback: true,
    proxy: proxyRoutes.map((route) => ({
      context: route,          // which requests to proxy
      target: pathAPIDevelopmentMode,
      changeOrigin: true,
      secure: false,
      proxyTimeout: 30000,
      timeout: 30000,
      agent: keepAliveAgent,   // keep-alive agent
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader("Referer", pathAPIDevelopmentMode);
      },
      bypass: (req, res, proxyOptions) => {
        const acceptHeader = req.headers.accept || "";
        if (acceptHeader.includes("text/html")) {
          return "/index.html";  // bypass API proxy for browser navigation
        }
      },
    })),
  },
};

module.exports = config;
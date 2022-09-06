module.exports = {
	presets: [
		[
			"@babel/preset-env",
			{
				targets: {
					node: "current",
				},
			},
		],
		"@babel/preset-typescript",
	],
	plugins: [
		[
			"module-resolver",
			{
				alias: {
					"@presentation": "./src/1-presentation",
					"@domain": "./src/2-domain",
					"@business": "./src/3-business",
					"@data": "./src/4-data",
          "@utils": "./src/utils"
				},
			},
		],
		["@babel/plugin-proposal-decorators", { legacy: true }],
	],
	ignore: ["**/*.spec.ts"],
};

const fetchJson = async (url, options = {}, attempts = 4) => {
	for (let attempt = 1; attempt <= attempts; attempt++) {
		try {
			const response = await fetch(url, options);
			const text = await response.text();
			if (!response.ok) {
				throw new Error(
					`${response.status} ${response.statusText} from ${url}: ${text.slice(0, 200)}`,
				);
			}
			return JSON.parse(text);
		} catch (error) {
			if (attempt === attempts) throw error;
			const delaySeconds = 15 * attempt;
			console.log(
				`⚠️ Attempt ${attempt} failed: ${error.message} — retrying in ${delaySeconds}s`,
			);
			await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
		}
	}
};

try {
	process.env.LESSONS = process.env.LESSONS ?? 1;

	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${process.env.DUOLINGO_JWT}`,
		"user-agent":
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
	};

	const { sub } = JSON.parse(
		Buffer.from(process.env.DUOLINGO_JWT.split(".")[1], "base64").toString(),
	);

	const { fromLanguage, learningLanguage } = await fetchJson(
		`https://www.duolingo.com/2017-06-30/users/${sub}?fields=fromLanguage,learningLanguage`,
		{
			headers,
		},
	);

	let xp = 0;
	for (let i = 0; i < process.env.LESSONS; i++) {
		const session = await fetchJson(
			"https://www.duolingo.com/2017-06-30/sessions",
			{
				body: JSON.stringify({
					challengeTypes: [
						"assist",
						"characterIntro",
						"characterMatch",
						"characterPuzzle",
						"characterSelect",
						"characterTrace",
						"characterWrite",
						"completeReverseTranslation",
						"definition",
						"dialogue",
						"extendedMatch",
						"extendedListenMatch",
						"form",
						"freeResponse",
						"gapFill",
						"judge",
						"listen",
						"listenComplete",
						"listenMatch",
						"match",
						"name",
						"listenComprehension",
						"listenIsolation",
						"listenSpeak",
						"listenTap",
						"orderTapComplete",
						"partialListen",
						"partialReverseTranslate",
						"patternTapComplete",
						"radioBinary",
						"radioImageSelect",
						"radioListenMatch",
						"radioListenRecognize",
						"radioSelect",
						"readComprehension",
						"reverseAssist",
						"sameDifferent",
						"select",
						"selectPronunciation",
						"selectTranscription",
						"svgPuzzle",
						"syllableTap",
						"syllableListenTap",
						"speak",
						"tapCloze",
						"tapClozeTable",
						"tapComplete",
						"tapCompleteTable",
						"tapDescribe",
						"translate",
						"transliterate",
						"transliterationAssist",
						"typeCloze",
						"typeClozeTable",
						"typeComplete",
						"typeCompleteTable",
						"writeComprehension",
					],
					fromLanguage,
					isFinalLevel: false,
					isV2: true,
					juicy: true,
					learningLanguage,
					smartTipsVersion: 2,
					type: "GLOBAL_PRACTICE",
				}),
				headers,
				method: "POST",
			},
		);

		const durationSeconds = 60 + Math.floor(Math.random() * 240);

		const response = await fetchJson(
			`https://www.duolingo.com/2017-06-30/sessions/${session.id}`,
			{
				body: JSON.stringify({
					...session,
					heartsLeft: 0,
					startTime: (+new Date() - durationSeconds * 1000) / 1000,
					enableBonusPoints: false,
					endTime: +new Date() / 1000,
					failed: false,
					maxInLessonStreak: 9,
					shouldLearnThings: true,
				}),
				headers,
				method: "PUT",
			},
		);

		xp += response.xpGain;
	}

	console.log(`🎉 You won ${xp} XP`);
} catch (error) {
	console.error("❌ Something went wrong");
	if (error instanceof Error) {
		console.error(error.message);
	}
	process.exit(1);
}

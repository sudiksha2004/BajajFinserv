export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST /bfhl allowed" });
  }

  // ======= EDIT THESE 3 CONSTANTS WITH YOUR DETAILS =======
  const FULL_NAME = "john_doe"; // lowercase full name with underscore
  const DOB_DDMMYYYY = "17091999"; // ddmmyyyy
  const EMAIL = "john@xyz.com";
  const ROLL = "ABCD123";
  // =========================================================

  const base = {
    is_success: true,
    user_id: `${FULL_NAME}_${DOB_DDMMYYYY}`,
    email: EMAIL,
    roll_number: ROLL,
  };

  try {
    // Body might be string or object
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const input = body?.data;

    // Input validation
    if (!Array.isArray(input)) {
      return res.status(200).json({
        ...base,
        is_success: false,
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: "",
      });
    }

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;

    // Collect ALL alphabetic characters for concat_string
    const allLetters = [];

    for (const raw of input) {
      const s = (raw ?? "").toString();

      // Collect letters for concat_string
      const letters = s.match(/[A-Za-z]/g);
      if (letters) allLetters.push(...letters);

      if (/^-?\d+$/.test(s)) {
        // numeric string
        const n = parseInt(s, 10);
        if (Math.abs(n) % 2 === 0) {
          even_numbers.push(s);
        } else {
          odd_numbers.push(s);
        }
        sum += n;
      } else if (/^[A-Za-z]+$/.test(s)) {
        // pure alphabetic
        alphabets.push(s.toUpperCase());
      } else {
        // special chars or mix
        special_characters.push(s);
      }
    }

    // Build concat_string (reverse letters, alternating caps)
    const concat_string = allLetters
      .reverse()
      .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
      .join("");

    return res.status(200).json({
      ...base,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string,
    });
  } catch (err) {
    return res.status(200).json({
      ...base,
      is_success: false,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
    });
  }
}

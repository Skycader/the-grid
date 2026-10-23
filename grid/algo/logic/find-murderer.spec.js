/* Police detective
 * 🎖CERTIFIED 2026-10-23
 * f(suspects, deadPeople) returns the name of the criminal: the suspect who saw ALL the killed people on the day
 * of the murders (he may have seen other people too). suspects is an object { suspect: [the people he saw] },
 * deadPeople is an array of names. Several suspects fit — the first one in the object; nobody fits — null.
 *
 * Example:
 *   suspects { Alex: [John, Natalie, Sergey], Sergey: [John, Sveta], Natalie: [John, Sveta, Sergey], Igor: [John] },
 *   deadPeople [John, Natalie]  →  "Alex"
 *
 * Scope:
 *   ✓ the criminal saw every killed person; seeing others too does not matter; the order of the lists does not
 *   ✓ a suspect who missed even one killed person is not the criminal, also when he saw many others
 *   ✓ one killed person, several, many; repeated names in the lists
 *   ✓ several suspects fit: the first one in the object is returned, so the order of the keys matters
 *   ✓ nobody fits, an empty object, a suspect who saw nobody: null
 *   ✓ names are compared exactly: case, a part of a name, spaces; names of any language
 *   ✓ the given object and arrays are not changed; the answer is a string or null
 *   ✓ speed: the timing test (6.4) searches in short cases again and again — the solution is compared with the
 *     reference one by STRICT mode
 *   ✗ not pinned: an empty list of killed people (everybody fits), keys that look like numbers (their order in
 *     an object is by value), a killed person who is also a suspect
 *
 * Difficulty: ★☆☆☆☆☆☆☆☆☆ (1/10)
 */

const f = require("./find-murderer.js");

const names = {
  suspects: {
    Alex: ["John", "Natalie", "Sergey"],
    Sergey: ["John", "Sveta"],
    Natalie: ["John", "Sveta", "Sergey"],
    Igor: ["John", "Natalie"],
  },
  dead: ["John", "Natalie"],
};

// everybody who is not a criminal saw a part of the killed people; the one who saw all of them is the last
const crowd = (count, dead, seenOf) => {
  const suspects = {};
  for (let i = 0; i < count; i++) suspects[`suspect${i}`] = seenOf(i);
  return suspects;
};

describe(":: Running test case for POLICE DETECTIVE", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should find the criminal", () => {
      expect(f(names.suspects, names.dead)).toBe("Alex");
    });

    it("1️⃣.2️⃣ should find the other criminal when the first suspects did not see everybody", () => {
      const suspects = {
        Alex: ["Sergey"],
        Sergey: ["John", "Sveta"],
        Natalie: ["Sveta", "Sergey", "John", "Natalie"],
        Igor: ["John", "Natalie"],
      };
      expect(f(suspects, names.dead)).toBe("Natalie");
    });

    it("1️⃣.3️⃣ should find the criminal who saw the killed people and more", () => {
      const suspects = {
        Alex: ["John", "Natalie", "Sergey", "Igor"],
        Sergey: ["John", "Sveta"],
        Natalie: ["John", "Sveta", "Sergey"],
        Igor: ["John", "Natalie"],
      };
      expect(f(suspects, names.dead)).toBe("Alex");
    });

    it("1️⃣.4️⃣ should return a string", () => {
      expect(typeof f(names.suspects, names.dead)).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ WHO IS THE CRIMINAL
  // ==========================================
  describe("2️⃣ Who is the criminal", () => {
    it("2️⃣.1️⃣ should take the suspect whose list is exactly the killed people", () => {
      expect(f({ Alex: ["John", "Natalie"], Igor: ["Sveta"] }, ["John", "Natalie"])).toBe("Alex");
    });

    it("2️⃣.2️⃣ should NOT depend on the order of the names in the lists", () => {
      expect(f({ Alex: ["Natalie", "John"] }, ["John", "Natalie"])).toBe("Alex");
      expect(f({ Alex: ["Sergey", "Natalie", "Sveta", "John"] }, ["John", "Natalie"])).toBe("Alex");
    });

    it("2️⃣.3️⃣ should NOT take a suspect who missed one killed person", () => {
      expect(f({ Alex: ["John"], Igor: ["Natalie"] }, ["John", "Natalie"])).toBeNull();
    });

    it("2️⃣.4️⃣ should NOT take a suspect who saw many people but missed one killed person", () => {
      const seen = ["Sveta", "Sergey", "Igor", "Olga", "Peter", "Mary", "John"];
      expect(f({ Alex: seen }, ["John", "Natalie"])).toBeNull();
    });

    it("2️⃣.5️⃣ should work with one killed person", () => {
      expect(f({ Alex: ["Sveta"], Igor: ["John", "Sveta"] }, ["John"])).toBe("Igor");
    });

    it("2️⃣.6️⃣ should work with many killed people", () => {
      const dead = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
      const suspects = { x: dead.slice(0, 9), y: [...dead].reverse().concat(["z"]), w: dead.slice(1) };
      expect(f(suspects, dead)).toBe("y");
    });

    it("2️⃣.7️⃣ should accept repeated names in the lists", () => {
      expect(f({ Alex: ["John", "John", "Natalie", "Natalie"] }, ["John", "Natalie"])).toBe("Alex");
      expect(f({ Alex: ["John", "John", "John"] }, ["John", "Natalie"])).toBeNull();
      expect(f({ Alex: ["John", "Natalie"] }, ["John", "John", "Natalie"])).toBe("Alex");
    });

    it("2️⃣.8️⃣ should find the criminal when he is the last of many suspects", () => {
      const suspects = { a: ["John"], b: ["Natalie"], c: [], d: ["Sveta"], e: ["John", "Natalie", "Sveta"] };
      expect(f(suspects, ["John", "Natalie"])).toBe("e");
    });
  });

  // ==========================================
  // 3️⃣ SEVERAL SUSPECTS FIT
  // ==========================================
  describe("3️⃣ Several suspects fit", () => {
    it("3️⃣.1️⃣ should return the first suspect of the object", () => {
      const suspects = { Alex: ["John", "Natalie"], Igor: ["John", "Natalie"], Sergey: ["John", "Natalie", "Sveta"] };
      expect(f(suspects, ["John", "Natalie"])).toBe("Alex");
    });

    it("3️⃣.2️⃣ should return the other one when the order of the keys is the other", () => {
      const suspects = { Sergey: ["John", "Natalie", "Sveta"], Igor: ["John", "Natalie"], Alex: ["John", "Natalie"] };
      expect(f(suspects, ["John", "Natalie"])).toBe("Sergey");
    });

    it("3️⃣.3️⃣ should skip the suspects who do not fit before the first one that fits", () => {
      const suspects = { Sveta: ["John"], Igor: ["John", "Natalie"], Alex: ["John", "Natalie", "Sergey"] };
      expect(f(suspects, ["John", "Natalie"])).toBe("Igor");
    });

    it("3️⃣.4️⃣ should find the one in the example from the task", () => {
      const suspects = {
        Alex: ["Sergey"],
        Sergey: ["John", "Sveta"],
        Natalie: ["Sveta", "Sergey", "John", "Natalie"],
        Igor: ["John", "Natalie"],
      };
      expect(f(suspects, ["John", "Natalie"])).toBe("Natalie");
    });
  });

  // ==========================================
  // 4️⃣ NOBODY FITS
  // ==========================================
  describe("4️⃣ Nobody fits", () => {
    it("4️⃣.1️⃣ should return null when nobody saw all the killed people", () => {
      expect(f({ Alex: ["John"], Sergey: ["Natalie"], Igor: ["Sveta"] }, ["John", "Natalie"])).toBeNull();
    });

    it("4️⃣.2️⃣ should return null for an empty object", () => {
      expect(f({}, ["John"])).toBeNull();
    });

    it("4️⃣.3️⃣ should return null when the suspects saw nobody", () => {
      expect(f({ Alex: [], Igor: [] }, ["John"])).toBeNull();
    });

    it("4️⃣.4️⃣ should return null (not undefined) when nobody fits", () => {
      expect(f({ Alex: ["Sveta"] }, ["John"]) === null).toBe(true);
    });

    it("4️⃣.5️⃣ should return null when the example people are the other ones", () => {
      expect(f(names.suspects, ["Olga", "Peter"])).toBeNull();
    });
  });

  // ==========================================
  // 5️⃣ THE NAMES
  // ==========================================
  describe("5️⃣ The names", () => {
    it("5️⃣.1️⃣ should compare the names exactly: the case matters", () => {
      expect(f({ Alex: ["john", "natalie"] }, ["John", "Natalie"])).toBeNull();
      expect(f({ Alex: ["John", "Natalie"] }, ["john", "natalie"])).toBeNull();
    });

    it("5️⃣.2️⃣ should NOT take a part of a name for a name", () => {
      expect(f({ Alex: ["Johnny", "Natalie"] }, ["John", "Natalie"])).toBeNull();
      expect(f({ Alex: ["Jo", "Natalie"] }, ["John", "Natalie"])).toBeNull();
    });

    it("5️⃣.3️⃣ should NOT ignore spaces around a name", () => {
      expect(f({ Alex: [" John", "Natalie "] }, ["John", "Natalie"])).toBeNull();
      expect(f({ Alex: ["John Smith"] }, ["John"])).toBeNull();
    });

    it("5️⃣.4️⃣ should work with names of any language", () => {
      const suspects = {
        Алексей: ["Иван", "Наталья", "Сергей"],
        Сергей: ["Иван", "Света"],
        Игорь: ["Иван", "Наталья"],
      };
      expect(f(suspects, ["Иван", "Наталья"])).toBe("Алексей");
    });

    it("5️⃣.5️⃣ should return the name of the suspect as it is written", () => {
      expect(f({ "Mary Ann": ["John"], "O'Neil": ["John"] }, ["John"])).toBe("Mary Ann");
      expect(f({ "O'Neil": ["John"] }, ["John"])).toBe("O'Neil");
    });
  });

  // ==========================================
  // 6️⃣ THE GIVEN DATA AND SPEED
  // ==========================================
  describe("6️⃣ The given data and speed", () => {
    let wide;
    let dead;
    let speed;

    beforeAll(() => {
      dead = Array.from({ length: 20 }, (_, i) => `dead${i}`);
      // 300 suspects: each saw 40 people, 19 of the 20 killed ones; the last one saw all of them
      wide = crowd(300, dead, (i) => {
        const seen = Array.from({ length: 21 }, (_, k) => `other${k}`);
        const part = i === 299 ? dead : dead.slice(0, 19);
        return seen.concat(part);
      });
      speed = [
        [names.suspects, names.dead],
        [{ Alex: ["Sergey"], Igor: ["John", "Natalie"] }, ["John", "Natalie"]],
        [{ Alex: ["John"], Igor: ["Natalie"] }, ["John", "Natalie"]],
        [{}, ["John"]],
        [{ a: ["x"], b: ["y"], c: ["x", "y", "z"] }, ["x", "y"]],
      ];
    });

    it("6️⃣.1️⃣ should NOT change the given object and arrays", () => {
      const suspects = { Igor: ["John"], Sveta: ["Natalie"], Alex: ["John", "Natalie", "Sergey"] };
      const killed = ["John", "Natalie"];
      f(suspects, killed);
      expect(suspects).toEqual({ Igor: ["John"], Sveta: ["Natalie"], Alex: ["John", "Natalie", "Sergey"] });
      expect(killed).toEqual(["John", "Natalie"]);
    });

    it("6️⃣.2️⃣ should work with an object and arrays that cannot be changed", () => {
      const suspects = Object.freeze({ Alex: Object.freeze(["John", "Natalie"]), Igor: Object.freeze(["John"]) });
      expect(f(suspects, Object.freeze(["John", "Natalie"]))).toBe("Alex");
    });

    it("6️⃣.3️⃣ should find the last of 300 suspects fast", () => {
      const t0 = Date.now();
      const found = f(wide, dead);
      const elapsed = Date.now() - t0;
      expect(found).toBe("suspect299");
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (10 000 searches in short cases).
    it("6️⃣.4️⃣ should stay fast on a lot of short cases", () => {
      let found = 0;
      for (let i = 0; i < 2000; i++) {
        for (let j = 0; j < speed.length; j++) if (f(speed[j][0], speed[j][1]) !== null) found++;
      }
      expect(found).toBe(2000 * 3);
    });
  });
});

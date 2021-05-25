function createMagic<T>(key: string) {
  return {
    get(): T | undefined {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch {
        localStorage.removeItem(key);
        return;
      }
    },
    set(value: T) {
      try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
      } catch {
        throw new Error("Unable to serialize value");
      }
    },
  };
}

const { get, set } = createMagic<{ name: string }>("user");
set({ name: "Bob" });
const user = get();
console.log(user);

メモです。
https://www.typescriptlang.org/play

```ts
// use union type instead of enum
const ResponseCode = {
  OK: 200,
  BAD_REQUEST: 400,
  SERVER_ERROR: 500
} as const;
type ResponseCode = typeof ResponseCode[keyof typeof ResponseCode];
const code: ResponseCode = 200;

// intersection type
type User = Required<{
  id: string,
  name: string,
  email: string,
}> & Partial<{
  address: string,
  phone: number
}>;
const user: User = {id: "aaa", name: "aaa", email: "aaa"};

// type assertion does not equal to cast
const num = 123;
const str: string = num as unknown as string;
console.log(typeof str); // number

// be careful when comparing with null
console.log(null == 0, null == false, null == "", null == undefined)

// type never
// const n: never = 1;
const m: string = 1 as never;
function fail(): never {
    throw new Error;
}

// overload
type F = ((v: number) => number) & ((v: string) => string);
const f :F = <T extends number | string>(v: T): T => {
  return v;
};

// 型ガード関数
function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}
const value: unknown = { a: 1, b: 2 };
const value2 = null;
if (isObject(value2)) {
  console.log(Object.keys(value2));
}

// Option Object
function x({ a: A = 1, b: B = 2 }: { a?: number, b?: number } = { a: 3, b: 4 }): void {
  console.log(A, B);
}
x();  // 3, 4
x({}); // 1, 2

class ABC {
  constructor(
    public a:string,
    protected b:number,
    private c:boolean
  ) {}
}

// このメソッドの実装むずかった
interface MyArray<T> {
  myMethod<U, This = undefined>(
    callback: (
      this: This,
      item: T
    ) => U,
    thisArg?: This
  ): U[]
}
class ma implements MyArray<string> {
    myMethod<U = number, This = undefined>(callback: (this: This, item: string) => U, thisArg?: This): U[] {
      // as入れないとダメ。正解は何だ？
      return [1] as U[];
    }
}

// インターフェースと型エイリアスの使い分け
// プリミティブな値やユニオン型やタプルの型定義をする場合は型エイリアスを利用し、オブジェクトの型を定義する場合はインターフェースを使うこと

// Map
const map = new Map<string, number>([
  ["a", 1]
]);
map.set("b", 2);
const n = map.get("c") ?? 0;
for (const [key, value] of map) {}

// コードが実行される時はコールスタックに入る。
// setTimeout、DOM操作などの非同期処理はタスクキュー（メッセージキュー）に入る。ただ、promiseはマイクロタスクキューに入る。
// イベントループは、コールスタックにタスクがなくなったら、マイクロタスクキュー -> タスクキューからコールバックを取り出してコールスタックに入れる

// ジェネリクス
function getRandom<T>(...items: T[]): T {
  const rand = Math.floor(Math.random() * items.length);
  return items[rand] as T;
}
console.log(getRandom<number>(1, 2, 3));

// カスタムタイプ
type MyOmit<T, KEYS extends keyof T> = {
  [K in keyof T as K extends KEYS ? never : K]: T[K]
};
type MyExclude<T, U extends T> = T extends U ? never : T;
type MyExtract<T, U extends T> = T extends U ? T : never;

//infer 
type passStringAndreturnString = (s: string) => string;
// 戻り値のtypeを取得
type returnType<F extends (...args: any[]) => any> = F extends (...args: any[]) => infer T ? T : never;
type sFromReturn = returnType<passStringAndreturnString>;
// 引数のtypeを取得
type argType<F extends (...args: any[]) => any> = F extends (...args: infer T) => any ? T : never;
type sFromArg = argType<passStringAndreturnString>;

// array to union type
const arr = ["a", "b", "c"] as const;
type typeFromArr = typeof arr[number];

// object keys to type
const obj = {a: 0, b: 1, c:2} as const;
type typeFromObjKey = keyof typeof obj;
 
 // map keys to type
type MapLike = { [K in "x" | "y" | "z"]: any };
type MapKeys = keyof MapLike;

// object values to type
type typeFromObjValues = typeof obj[typeFromObjKey];


type sample = {a: 1, b:2, c?:3};
type myRequired<T> = {
  [K in keyof T]-?: T[K]
}
type myOptional<T> = {
  [K in keyof T]?: T[K]
}
type myPartial<T, KEYS extends keyof T> = {
  [K in keyof T as K extends KEYS ? K : never]: T[K]
}
type aaa = myPartial<sample, "a" | "b">;
```

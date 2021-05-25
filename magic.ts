import * as ts from "typescript";
import * as crypto from "crypto";

export function magicTransformer<
  T extends ts.Node
>(): ts.TransformerFactory<T> {
  return (context) => {
    const visit: ts.Visitor = (node) => {
      if (
        ts.isCallExpression(node) &&
        node.expression.getText() === "createMagic"
      ) {
        const key = node.arguments[0].getText().replace(/"/g, "");
        const typeKey = node.typeArguments[0].getText();

        const hash = crypto.createHash("md5").update(typeKey).digest("hex");
        return context.factory.createCallExpression(
          node.expression,
          undefined,
          [ts.factory.createStringLiteral(`${key}-${hash}`)]
        );
      }
      return ts.visitEachChild(node, (child) => visit(child), context);
    };

    return (node) => ts.visitNode(node, visit);
  };
}

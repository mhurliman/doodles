INTEGER, PLUS, MINUS, MULT, DIV, LPAREN, RPAREN, EOF = 'INTEGER', 'PLUS', 'MINUS', 'MULT', 'DIV', 'LPAREN', 'RPAREN', 'EOF'

UNARY_OPS = {
    PLUS : lambda x: x,
    MINUS : lambda x: -x,
}

BIN_OPS = {
    PLUS : lambda x, y: x + y,
    MINUS : lambda x, y: x - y,
    MULT : lambda x, y: x * y,
    DIV : lambda x, y: x / y,
}

class Token(object):
    def __init__(self, type, value):
        self.type = type
        self.value = value

    def __str__(self):
        return 'Token({type}, {value})'.format(
            type=self.type,
            value=repr(self.value)
        )

    def __repr__(self):
        return self.__str__()


class Lexer(object):
    def __init__(self, text):
        self.text = text
        self.pos = 0
        self.current_char = self.text[self.pos]

    def error(self):
        raise Exception('Error parsing input')

    def advance(self):
        self.pos += 1
        if self.pos > len(self.text) - 1:
            self.current_char = None
        else:
            self.current_char = self.text[self.pos]

    def skip_whitespace(self):
        while self.current_char is not None and self.current_char.isspace():
            self.advance()

    def integer(self):
        result = ''
        while self.current_char is not None and self.current_char.isdigit():
            result += self.current_char
            self.advance()

        return int(result)

    def get_next_token(self):
        while self.current_char is not None:

            if self.current_char.isspace():
                self.skip_whitespace()
                continue

            if self.current_char.isdigit():
                return Token(INTEGER, self.integer())

            if self.current_char == '+':
                self.advance()
                return Token(PLUS, '+')

            if self.current_char == '-':
                self.advance()
                return Token(MINUS, '-')

            if self.current_char == '*':
                self.advance()
                return Token(MULT, '*')

            if self.current_char == '/':
                self.advance()
                return Token(DIV, '/')

            if self.current_char == '(':
                self.advance()
                return Token(LPAREN, '(')

            if self.current_char == ')':
                self.advance()
                return Token(RPAREN, ')')

            print(self.current_char)
            self.error()

        return Token(EOF, None)


class AST(object):
    pass

class Num(AST):
    def __init__(self, token):
        self.token = token
        self.value = token.value

class BinOp(AST):
    def __init__(self, left, op, right):
        self.left = left
        self.token = self.op = op
        self.right = right
        self.func = BIN_OPS[self.op.type]

class UnaryOp(AST):
    def __init__(self, op, expr):
        self.token = self.op = op
        self.expr = expr
        self.func = UNARY_OPS[self.op.type]

class Parser(object):
    def __init__(self, lexer):
        self.lexer = lexer
        self.current_token = self.lexer.get_next_token()

    def error(self):
        raise Exception('Error parsing input')

    def eat(self, token_type):
        if self.current_token.type == token_type:
            self.current_token = self.lexer.get_next_token()
        else:
            print(self.current_token)
            self.error()

    def factor(self):
        token = self.current_token

        if token.type == PLUS:
            self.eat(PLUS)
            return UnaryOp(token, self.factor())

        elif token.type == MINUS:
            self.eat(MINUS)
            return UnaryOp(token, self.factor())

        elif token.type == INTEGER:
            self.eat(INTEGER)
            return Num(token)

        elif token.type == LPAREN:
            self.eat(LPAREN)
            node = self.expr()
            self.eat(RPAREN)

            return node

    def term(self):
        node = self.factor()

        while self.current_token.type in (MULT, DIV):
            token = self.current_token

            self.eat(token.type)
            node = BinOp(node, token, self.factor())

        return node

    def expr(self):
        node = self.term()

        while self.current_token.type in (PLUS, MINUS):
            token = self.current_token

            self.eat(token.type)
            node = BinOp(node, token, self.term())

        return node

    def parse(self):
        return self.expr()

class NodeVisitor(object):
    def visit(self, node):
        method_name = 'visit_' + type(node).__name__
        visitor = getattr(self, method_name, self.generic_visit)
        return visitor(node)

    def generic_visit(self, node):
        raise Exception('No visit_{} method'.format(type(node).__name__))

class Interpreter(NodeVisitor):
    def __init__(self, parser):
        self.parser = parser

    def visit_UnaryOp(self, node):
        return node.func(self.visit(node.expr))

    def visit_BinOp(self, node):
        return node.func(self.visit(node.left), self.visit(node.right))

    def visit_Num(self, node):
        return node.value

    def interpret(self):
        tree = self.parser.parse()
        return self.visit(tree)

class RPNPrinter(NodeVisitor):
    def __init__(self, parser):
        self.parser = parser

    def visit_UnaryOp(self, node):
        return "{}{}".format(node.op.value, self.visit(node.expr))

    def visit_BinOp(self, node):
        return "({} {} {})".format(self.visit(node.left), self.visit(node.right), node.op.value)

    def visit_Num(self, node):
        return node.value

    def interpret(self):
        tree = self.parser.parse()
        return self.visit(tree)

class LispPrinter(NodeVisitor):
    def __init__(self, parser):
        self.parser = parser

    def visit_UnaryOp(self, node):
        return "{}{}".format(node.op.value, self.visit(node.expr))

    def visit_BinOp(self, node):
        return "({} {} {})".format(node.op.value, self.visit(node.left), self.visit(node.right))

    def visit_Num(self, node):
        return node.value

    def interpret(self):
        tree = self.parser.parse()
        return self.visit(tree)

def main():
    while True:
        try:
            text = input('calc> ')

        except EOFError:
            break

        if not text:
            continue

        lexer = Lexer(text)
        parser = Parser(lexer)
        interpreter = Interpreter(parser)

        result = interpreter.interpret()
        print(result)

if __name__ == '__main__':
    main()

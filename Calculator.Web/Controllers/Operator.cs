using System;

namespace Calculator.Web.Controllers
{
    public abstract class Operator
    {
        public static Operator Add { get; } = new AddOperator();
        public static Operator Subtract { get; } = new SubtractOperator();
        public static Operator Multiply { get; } = new MultiplyOperator();
        public static Operator Divide { get; } = new DivideOperator();

        private class AddOperator : Operator
        {
            public override decimal Apply(decimal operand1, decimal operand2)
            {
                return operand1 + operand2;
            }

            public override string ToString()
            {
                return "+";
            }
        }

        private class SubtractOperator : Operator
        {
            public override decimal Apply(decimal operand1, decimal operand2)
            {
                return operand1 - operand2;
            }

            public override string ToString()
            {
                return "-";
            }
        }

        private class MultiplyOperator : Operator
        {
            public override decimal Apply(decimal operand1, decimal operand2)
            {
                return operand1 * operand2;
            }

            public override string ToString()
            {
                return "x";
            }
        }

        private class DivideOperator : Operator
        {
            public override decimal Apply(decimal operand1, decimal operand2)
            {
                return operand1 / operand2;
            }

            public override string ToString()
            {
                return "/";
            }
        }

        public abstract decimal Apply(decimal operand1, decimal operand2);
    }
}

using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace Calculator.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalculationController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<Calculation> Get()
        {
            throw new NotImplementedException();
        }

        [HttpGet("{id}")]
        public Calculation Get(int id)
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        public decimal Post([FromBody] Calculation calculation)
        {
            var op = OperatorFactory.Create(calculation.Operator);
            decimal result = op.Apply(calculation.Subtotal, calculation.Operand);
            return result;
        }
    }

    public static class OperatorFactory
    {
        public static Operator Create(OperatorDescriptor descriptor)
        {
            switch (descriptor.Name)
            {
                case "ADD":
                    return Operator.Add;
                case "SUBTRACT":
                    return Operator.Subtract;
                case "MULTIPLY":
                    return Operator.Multiply;
                case "DIVIDE":
                    return Operator.Divide;
                default:
                    throw new NotSupportedException($"Operator \"{descriptor.Name}\" is not supported.");
            }
        }
    }

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
        }

        private class SubtractOperator : Operator
        {
            public override decimal Apply(decimal operand1, decimal operand2)
            {
                return operand1 - operand2;
            }
        }

        private class MultiplyOperator : Operator
        {
            public override decimal Apply(decimal operand1, decimal operand2)
            {
                return operand1 * operand2;
            }
        }

        private class DivideOperator : Operator
        {
            public override decimal Apply(decimal operand1, decimal operand2)
            {
                return operand1 / operand2;
            }
        }

        public abstract decimal Apply(decimal operand1, decimal operand2);
    }
}

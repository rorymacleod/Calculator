using System;

namespace Calculator.Web.Controllers
{
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
}

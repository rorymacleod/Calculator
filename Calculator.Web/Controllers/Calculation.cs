using System;
using System.Collections.Generic;
using System.Linq;

namespace Calculator.Web.Controllers
{
    public class Calculation
    {
        public decimal Subtotal { get; set; }
        public decimal Operand { get; set; }
        public OperatorDescriptor Operator { get; set; }
    }
}

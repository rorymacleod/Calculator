using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace Calculator.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalculationController : ControllerBase
    {
        private static readonly Operator[] Operators = {
            Operator.Add,
            Operator.Subtract,
            Operator.Multiply,
            Operator.Divide
        };

        [HttpGet]
        public IEnumerable<CalcLogEntry> Get()
        {
            int id = 0;
            var fake = new Bogus.Faker();
            return Enumerable
                .Range(1, 5)
                .Select(index => {
                    var op = fake.Random.CollectionItem(Operators);
                    var entry = new CalcLogEntry {
                        Id = id++,
                        DateTime = fake.Date.Recent(),
                        Subtotal = Math.Round(fake.Random.Decimal(max: 10), 1),
                        Value = Math.Round(fake.Random.Decimal(max: 10), 1),
                        Operator = op.ToString(),
                        ClientAddress = fake.Internet.IpAddress().ToString(),
                    };
                    return entry;
                })
                .ToList();
        }

        [HttpPost]
        public decimal Post([FromBody] Calculation calculation)
        {
            var op = OperatorFactory.Create(calculation.Operator);
            decimal result = op.Apply(calculation.Subtotal, calculation.Operand);
            return result;
        }
    }

    public class CalcLogEntry
    {
        public int Id { get; set; }
        public DateTime DateTime { get; set; }
        public decimal Subtotal { get; set; }
        public string Operator { get; set; }
        public decimal Value { get; set; }
        public string ClientAddress { get; set; }
    }

}

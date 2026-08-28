using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MasterDetail.BusinessLogic;
using MasterDetail.BusinessLogic.Models;
using MasterDetail.BusinessLogic.Repository;
using MasterDetail.Common;
using Moq;
using Moq.Protected;
using Xunit;

namespace MasterDetail.BusinessLogic.UnitTest.Repository.Test
{
    // NOTE: BaseRepository<T>'s own methods (GetAllAsync, CreateAsync, UpdateAsync, DeleteAsync,
    // BulkInsertAsync, BulkUpdateAsync, BulkDeleteAsync, GetPageSortFilterAsync) talk to SQL Server
    // directly via SqlConnection/SqlDataAdapter with no injectable seam, so they cannot be exercised
    // as true unit tests here. Only ChildRepository's own logic - building the filter clause and
    // delegating to the protected GetByUniqueKey/GetByForeignKey primitives - is unit-testable, so
    // that is what these tests cover. SQL/mapping behavior belongs in an integration test suite.
    public class ChildRepositoryTests
    {
        private readonly Mock<IConnectionStringFactory> _connectionStringFactoryMock;

        public ChildRepositoryTests()
        {
            _connectionStringFactoryMock = new Mock<IConnectionStringFactory>();
        }

        [Fact]
        public async Task GetByIdAsync_ShouldBuildChildIdFilter_AndDelegateToGetByUniqueKey()
        {
            // Arrange
            var childId = 1;
            var expected = new ChildRecord { ChildId = 1 };

            var repoMock = new Mock<ChildRepository>(_connectionStringFactoryMock.Object) { CallBase = true };
            repoMock
                .Protected()
                .Setup<Task<ChildRecord>>(
                    "GetByUniqueKey",
                    Database.NonScalling,
                    ItExpr.Is<List<FilterBySetting>>(f => f.Count == 1 && f[0].FilterByClause == "ChildId = " + childId),
                    ItExpr.IsAny<List<OrderBySetting>>(),
                    false)
                .ReturnsAsync(expected);

            // Act
            var result = await repoMock.Object.GetByIdAsync(Database.NonScalling, childId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expected.ChildId, result.ChildId);
        }

        [Fact]
        public async Task GetAllByDetailIdAsync_ShouldBuildDetailIdFilter_AndDelegateToGetByForeignKey()
        {
            // Arrange
            var detailId = 1;
            var expected = new List<ChildRecord> { new ChildRecord { ChildId = 1 } };

            var repoMock = new Mock<ChildRepository>(_connectionStringFactoryMock.Object) { CallBase = true };
            repoMock
                .Protected()
                .Setup<Task<IEnumerable<ChildRecord>>>(
                    "GetByForeignKey",
                    Database.NonScalling,
                    ItExpr.Is<List<FilterBySetting>>(f => f.Count == 1 && f[0].FilterByClause == "DetailId = " + detailId),
                    ItExpr.IsAny<List<OrderBySetting>>(),
                    false)
                .ReturnsAsync(expected);

            // Act
            var result = await repoMock.Object.GetAllByDetailIdAsync(detailId, Database.NonScalling);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(expected[0].ChildId, result.Single().ChildId);
        }

        [Fact]
        public async Task GetAllByMasterIdAsync_ShouldBuildMasterIdFilter_AndDelegateToGetByForeignKey()
        {
            // Arrange
            var masterId = 1;
            var expected = new List<ChildRecord> { new ChildRecord { ChildId = 1 } };

            var repoMock = new Mock<ChildRepository>(_connectionStringFactoryMock.Object) { CallBase = true };
            repoMock
                .Protected()
                .Setup<Task<IEnumerable<ChildRecord>>>(
                    "GetByForeignKey",
                    Database.NonScalling,
                    ItExpr.Is<List<FilterBySetting>>(f => f.Count == 1 && f[0].FilterByClause == "MasterId = " + masterId),
                    ItExpr.IsAny<List<OrderBySetting>>(),
                    false)
                .ReturnsAsync(expected);

            // Act
            var result = await repoMock.Object.GetAllByMasterIdAsync(masterId, Database.NonScalling);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(expected[0].ChildId, result.Single().ChildId);
        }
    }
}

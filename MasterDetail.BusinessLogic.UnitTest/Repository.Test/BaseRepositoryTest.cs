
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using MasterDetail.BusinessLogic;
using MasterDetail.BusinessLogic.Models;
using MasterDetail.BusinessLogic.Repository;
using MasterDetail.Common;
using Moq;
using Moq.Protected;
using Xunit;

namespace MasterDetail.Tests.Repository
{
    public class BaseRepositoryTests
    {
        private readonly Mock<IConnectionStringFactory> _connectionStringFactoryMock;
        private readonly Mock<BaseRepository<TestEntity>> _repositoryMock;

        public BaseRepositoryTests()
        {
            _connectionStringFactoryMock = new Mock<IConnectionStringFactory>();
            _connectionStringFactoryMock.Setup(x => x.GetConnectionString()).Returns("FakeConnectionString");

            _repositoryMock = new Mock<BaseRepository<TestEntity>>(_connectionStringFactoryMock.Object) { CallBase = false };
        }

 
        [Fact]
        public async Task GetAllAsync_ShouldReturnEntities()
        {
            // Arrange
            var orgId = 1;
            var expectedEntities = new List<TestEntity> { new TestEntity { Id = 1, Name = "Test" } };

            _repositoryMock
                .Setup(r => r.GetAllAsync(orgId, false))
                .ReturnsAsync(expectedEntities);

            // Act
            var result = await _repositoryMock.Object.GetAllAsync(orgId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedEntities.Count, result.Count());
        }


        
        [Fact]
        public async Task CreateAsync_ShouldReturnCreatedEntity()
        {
            // Arrange
            var orgId = 1;
            var entity = new TestEntity { Id = 0, Name = "Test" };
            var expectedEntity = new TestEntity { Id = 1, Name = "Test" };

            _repositoryMock
                .Setup(r => r.CreateAsync(orgId, entity, false))
                .ReturnsAsync(expectedEntity);

            // Act
            var result = await _repositoryMock.Object.CreateAsync(orgId, entity, false);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedEntity.Id, result.Id);
            Assert.Equal(expectedEntity.Name, result.Name);
        }


        [Fact]
        public async Task DeleteAsync_ShouldReturnRowsDeleted()
        {
            // Arrange
            var orgId = 1;
            var entity = new TestEntity { Id = 1, Name = "Test" };
            var expectedCount = 1;

            // Mock database interaction
            MockDatabaseHelper.SetupExecuteScalar(1);

            _repositoryMock
               .Setup(r => r.DeleteAsync(orgId, entity, false))
               .ReturnsAsync(expectedCount);

            // Act
            var result = await _repositoryMock.Object.DeleteAsync(orgId, entity, false);


            // Assert
            Assert.Equal(expectedCount, result);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnRowsUpdated()
        {
            // Arrange
            var orgId = 1;
            var entity = new TestEntity { Id = 1, Name = "Updated" };
            var expectedCount = 1;

            // Mock database interaction
            MockDatabaseHelper.SetupExecuteScalar(1);

            _repositoryMock
               .Setup(r => r.UpdateAsync(orgId, entity, false))
               .ReturnsAsync(expectedCount);

            // Act
            var result = await _repositoryMock.Object.UpdateAsync(orgId, entity, false);

            // Assert
            Assert.Equal(expectedCount, result);
        }

        [Fact]
        public async Task BulkInsertAsync_ShouldReturnInsertedEntities()
        {
            // Arrange
            var orgId = 1;
            var entities = new List<TestEntity>
            {
                new TestEntity { Id = 0, Name = "Test1" },
                new TestEntity { Id = 0, Name = "Test2" }
            };
            var expectedEntities = new List<TestEntity>
            {
                new TestEntity { Id = 1, Name = "Test1" },
                new TestEntity { Id = 2, Name = "Test2" }
            };

            // Mock database interaction
            DataTable dataTable = entities.ToDataTable();
            MockDatabaseHelper.SetupFillDataTable(dataTable);

            // Act
            _repositoryMock
               .Setup(r => r.BulkInsertAsync(orgId, entities, false))
               .ReturnsAsync(expectedEntities);

            // Act
            var result = await _repositoryMock.Object.BulkInsertAsync(orgId, entities, false);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(entities.Count, result.Count());
            Assert.True(result.All(e => e.Id > 0));
        }

        [Fact]
        public async Task BulkUpdateAsync_ShouldReturnRowsUpdated()
        {
            // Arrange
            var orgId = 1;
            var entities = new List<TestEntity>
            {
                new TestEntity { Id = 1, Name = "Updated1" },
                new TestEntity { Id = 2, Name = "Updated2" }
            };
            var expectedCount = entities.Count;

            // Mock database interaction
            MockDatabaseHelper.SetupExecuteScalar(2);

            _repositoryMock
               .Setup(r => r.BulkUpdateAsync(orgId, entities, false))
               .ReturnsAsync(expectedCount);

            // Act
            var result = await _repositoryMock.Object.BulkUpdateAsync(orgId, entities, false);

            // Assert
            Assert.Equal(expectedCount, result);
        }

        [Fact]
        public async Task BulkDeleteAsync_ShouldReturnRowsDeleted()
        {
            // Arrange
            var orgId = 1;
            var entities = new List<TestEntity>
            {
                new TestEntity { Id = 1, Name = "Test1" },
                new TestEntity { Id = 2, Name = "Test2" }
            };
            var expectedCount = entities.Count;

            // Mock database interaction
            MockDatabaseHelper.SetupExecuteScalar(2);

            _repositoryMock
               .Setup(r => r.BulkDeleteAsync(orgId, entities, false))
               .ReturnsAsync(expectedCount);

            // Act
            var result = await _repositoryMock.Object.BulkDeleteAsync(orgId, entities, false);

            // Assert
            Assert.Equal(expectedCount, result);
        }

        [Fact]
        public async Task GetPageSortFilterAsync_ShouldReturnPagedResult()
        {
            // Arrange
            var orgId = 1;
            var model = new PageSortFilterModel
            {
                Skip = 0,
                Take = 10,
                IncludeTotalCount = true,
                IncludeFilteredCount = true,
                OrderbyList = new List<OrderBySetting>(),
                FilterByList = new List<FilterBySetting>()
            };

            var expectedResult = new PageOrderFilterReturn
            {
                TotalCount = 100,
                FilteredCount = 50,
                Content = new List<TestEntity> { new TestEntity { Id = 1, Name = "Test" } }
            };

            // Mock database interaction
            MockDatabaseHelper.SetupFillDataSet(expectedResult);

            // Act
            _repositoryMock
              .Setup(r => r.GetPageSortFilterAsync(orgId, model, false))
              .ReturnsAsync(expectedResult);

            // Act
            var result = await _repositoryMock.Object.GetPageSortFilterAsync(orgId, model, false);


            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedResult.TotalCount, result.TotalCount);
            Assert.Equal(expectedResult.FilteredCount, result.FilteredCount);
        }
    }

    // Helper class for mocking database interactions
    public static class MockDatabaseHelper
    {
        public static void SetupFillDataTable(DataTable dataTable)
        {
            // Mock logic to simulate filling a DataTable
        }

        public static void SetupExecuteScalar(int result)
        {
            // Mock logic to simulate ExecuteScalar
        }

        public static void SetupFillDataSet(PageOrderFilterReturn result)
        {
            // Mock logic to simulate filling a DataSet
        }
    }

    // Test entity class
    public class TestEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
  
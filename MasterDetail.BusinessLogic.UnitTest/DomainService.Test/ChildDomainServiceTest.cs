using System.Collections.Generic;
using System.Threading.Tasks;
using MasterDetail.BusinessLogic.DomainServices;
using MasterDetail.BusinessLogic.Models;
using MasterDetail.BusinessLogic.Repository;
using MasterDetail.Common;
using Moq;
using Xunit;

namespace MasterDetail.BusinessLogic.UnitTest.DomainService.Test
{
    public class ChildDomainServiceTests
    {
        private readonly Mock<IRepositoryContext> _repositoryMock;
        private readonly Mock<IDomainServiceContext> _domainServiceMock;
        private readonly ChildDomainService _service;

        public ChildDomainServiceTests()
        {
            _repositoryMock = new Mock<IRepositoryContext>();
            _domainServiceMock = new Mock<IDomainServiceContext>();
            _service = new ChildDomainService(_domainServiceMock.Object, _repositoryMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllChildren()
        {
            // Arrange
            var children = new List<ChildRecord>
            {
                new ChildRecord { ChildId = 1 },
                new ChildRecord { ChildId = 2 }
            };
            _repositoryMock.Setup(x => x.ChildRepository.GetAllAsync(Database.NonScalling, false))
                .ReturnsAsync(children);

            // Act
            var result = await _service.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(children.Count, result.Count);
        }

        [Fact]
        public async Task GetChildByIdAsync_ShouldReturnChild_WhenFound()
        {
            // Arrange
            var childId = 1;
            var child = new ChildRecord { ChildId = 1 };
            _repositoryMock.Setup(x => x.ChildRepository.GetByIdAsync(Database.NonScalling, childId, false))
                .ReturnsAsync(child);

            // Act
            var result = await _service.GetChildByIdAsync(childId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(child.ChildId, result.ChildId);
        }

        [Fact]
        public async Task GetChildByIdAsync_ShouldReturnNull_WhenNotFound()
        {
            // Arrange
            var childId = 1;
            _repositoryMock.Setup(x => x.ChildRepository.GetByIdAsync(Database.NonScalling, childId, false))
                .ReturnsAsync((ChildRecord)null);

            // Act
            var result = await _service.GetChildByIdAsync(childId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetChildsByMasterIdAsync_ShouldReturnChildren_WhenFound()
        {
            // Arrange
            var masterId = 1;
            var children = new List<ChildRecord>
            {
                new ChildRecord { ChildId = 1, MasterId = 1 },
                new ChildRecord { ChildId = 2, MasterId = 1 }
            };
            _repositoryMock.Setup(x => x.ChildRepository.GetAllByMasterIdAsync(masterId, Database.NonScalling, false))
                .ReturnsAsync(children);

            // Act
            var result = await _service.GetChildsByMasterIdAsync(masterId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(children.Count, result.Count);
        }

        [Fact]
        public async Task GetChildsByDetailIdAsync_ShouldReturnChildren_WhenFound()
        {
            // Arrange
            var detailId = 1;
            var children = new List<ChildRecord>
            {
                new ChildRecord { ChildId = 1, DetailId = 1 },
                new ChildRecord { ChildId = 2, DetailId = 1 }
            };
            _repositoryMock.Setup(x => x.ChildRepository.GetAllByDetailIdAsync(detailId, Database.NonScalling, false))
                .ReturnsAsync(children);

            // Act
            var result = await _service.GetChildsByDetailIdAsync(detailId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(children.Count, result.Count);
        }

        [Fact]
        public async Task GetPageSortFilterAsync_ShouldReturnPagedResult()
        {
            // Arrange
            var model = new PageSortFilterModel
            {
                Skip = 0,
                Take = 10,
                IncludeTotalCount = true,
                IncludeFilteredCount = true,
                OrderbyList = new List<OrderBySetting>(),
                FilterByList = new List<FilterBySetting>()
            };
            var expected = new PageOrderFilterReturn
            {
                TotalCount = 100,
                FilteredCount = 50,
                Content = new List<ChildRecord> { new ChildRecord { ChildId = 1 } }
            };
            _repositoryMock.Setup(x => x.ChildRepository.GetPageSortFilterAsync(Database.NonScalling, model, false))
                .ReturnsAsync(expected);

            // Act
            var result = await _service.GetPageSortFilterAsync(model);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expected.TotalCount, result.TotalCount);
            Assert.Equal(expected.FilteredCount, result.FilteredCount);
            Assert.Equal(expected.Content.Count, result.Content.Count);
        }

        [Fact]
        public async Task CreateChildAsync_ShouldReturnCreatedChild()
        {
            // Arrange
            var child = new ChildRecord { ChildId = 1 };
            _repositoryMock.Setup(x => x.ChildRepository.CreateAsync(Database.NonScalling, child, false))
                .ReturnsAsync(child);

            // Act
            var result = await _service.CreateChildAsync(child);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(child.ChildId, result.ChildId);
        }

        [Fact]
        public async Task UpdateChildAsync_ShouldReturnTrue_WhenUpdateSuccessful()
        {
            // Arrange
            var child = new ChildRecord { ChildId = 1 };
            _repositoryMock.Setup(x => x.ChildRepository.UpdateAsync(Database.NonScalling, child, false))
                .ReturnsAsync(1);

            // Act
            var result = await _service.UpdateChildAsync(child);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task UpdateChildAsync_ShouldReturnFalse_WhenUpdateFails()
        {
            // Arrange
            var child = new ChildRecord { ChildId = 1 };
            _repositoryMock.Setup(x => x.ChildRepository.UpdateAsync(Database.NonScalling, child, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.UpdateChildAsync(child);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task DeleteChildAsync_ShouldReturnTrue_WhenDeleteSuccessful()
        {
            // Arrange
            var child = new ChildRecord { ChildId = 1 };
            _repositoryMock.Setup(x => x.ChildRepository.DeleteAsync(Database.NonScalling, child, false))
                .ReturnsAsync(1);

            // Act
            var result = await _service.DeleteChildAsync(child);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task DeleteChildAsync_ShouldReturnFalse_WhenDeleteFails()
        {
            // Arrange
            var child = new ChildRecord { ChildId = 1 };
            _repositoryMock.Setup(x => x.ChildRepository.DeleteAsync(Database.NonScalling, child, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.DeleteChildAsync(child);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task BulkCreateChildAsync_ShouldReturnCreatedChildren()
        {
            // Arrange
            var children = new List<ChildRecord>
            {
                new ChildRecord { ChildId = 1 },
                new ChildRecord { ChildId = 2 }
            };
            _repositoryMock.Setup(x => x.ChildRepository.BulkInsertAsync(Database.NonScalling, children, false))
                .ReturnsAsync(children);

            // Act
            var result = await _service.BulkCreateChildAsync(children);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(children.Count, result.Count);
        }

        [Fact]
        public async Task BulkUpdateChildAsync_ShouldReturnTrue_WhenUpdateSuccessful()
        {
            // Arrange
            var children = new List<ChildRecord>
            {
                new ChildRecord { ChildId = 1 },
                new ChildRecord { ChildId = 2 }
            };
            _repositoryMock.Setup(x => x.ChildRepository.BulkUpdateAsync(Database.NonScalling, children, false))
                .ReturnsAsync(2);

            // Act
            var result = await _service.BulkUpdateChildAsync(children);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task BulkUpdateChildAsync_ShouldReturnFalse_WhenUpdateFails()
        {
            // Arrange
            var children = new List<ChildRecord>
            {
                new ChildRecord { ChildId = 1 },
                new ChildRecord { ChildId = 2 }
            };
            _repositoryMock.Setup(x => x.ChildRepository.BulkUpdateAsync(Database.NonScalling, children, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.BulkUpdateChildAsync(children);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task BulkDeleteChildAsync_ShouldReturnTrue_WhenDeleteSuccessful()
        {
            // Arrange
            var children = new List<ChildRecord>
            {
                new ChildRecord { ChildId = 1 },
                new ChildRecord { ChildId = 2 }
            };
            _repositoryMock.Setup(x => x.ChildRepository.BulkDeleteAsync(Database.NonScalling, children, false))
                .ReturnsAsync(2);

            // Act
            var result = await _service.BulkDeleteChildAsync(children);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task BulkDeleteChildAsync_ShouldReturnFalse_WhenDeleteFails()
        {
            // Arrange
            var children = new List<ChildRecord>
            {
                new ChildRecord { ChildId = 1 },
                new ChildRecord { ChildId = 2 }
            };
            _repositoryMock.Setup(x => x.ChildRepository.BulkDeleteAsync(Database.NonScalling, children, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.BulkDeleteChildAsync(children);

            // Assert
            Assert.False(result);
        }
    }
}

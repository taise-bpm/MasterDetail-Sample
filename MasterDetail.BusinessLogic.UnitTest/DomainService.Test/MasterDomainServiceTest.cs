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
    public class MasterDomainServiceTests
    {
        private readonly Mock<IRepositoryContext> _repositoryMock;
        private readonly Mock<IDomainServiceContext> _domainServiceMock;
        private readonly MasterDomainService _service;

        public MasterDomainServiceTests()
        {
            _repositoryMock = new Mock<IRepositoryContext>();
            _domainServiceMock = new Mock<IDomainServiceContext>();
            _service = new MasterDomainService(_domainServiceMock.Object, _repositoryMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllMasters()
        {
            // Arrange
            var masters = new List<MasterRecord>
            {
                new MasterRecord { MasterId = 1 },
                new MasterRecord { MasterId = 2 }
            };
            _repositoryMock.Setup(x => x.MasterRepository.GetAllAsync(Database.NonScalling, false))
                .ReturnsAsync(masters);

            // Act
            var result = await _service.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(masters.Count, result.Count);
        }

        [Fact]
        public async Task GetMasterByIdAsync_ShouldReturnMaster_WhenFound()
        {
            // Arrange
            var masterId = 1;
            var master = new MasterRecord { MasterId = 1 };
            _repositoryMock.Setup(x => x.MasterRepository.GetByIdAsync(Database.NonScalling, masterId, false))
                .ReturnsAsync(master);

            // Act
            var result = await _service.GetMasterByIdAsync(masterId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(master.MasterId, result.MasterId);
        }

        [Fact]
        public async Task GetMasterByIdAsync_ShouldReturnNull_WhenNotFound()
        {
            // Arrange
            var masterId = 1;
            _repositoryMock.Setup(x => x.MasterRepository.GetByIdAsync(Database.NonScalling, masterId, false))
                .ReturnsAsync((MasterRecord)null);

            // Act
            var result = await _service.GetMasterByIdAsync(masterId);

            // Assert
            Assert.Null(result);
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
                Content = new List<MasterRecord> { new MasterRecord { MasterId = 1 } }
            };
            _repositoryMock.Setup(x => x.MasterRepository.GetPageSortFilterAsync(Database.NonScalling, model, false))
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
        public async Task CreateMasterAsync_ShouldReturnCreatedMaster()
        {
            // Arrange
            var master = new MasterRecord { MasterId = 1 };
            _repositoryMock.Setup(x => x.MasterRepository.CreateAsync(Database.NonScalling, master, false))
                .ReturnsAsync(master);

            // Act
            var result = await _service.CreateMasterAsync(master);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(master.MasterId, result.MasterId);
        }

        [Fact]
        public async Task UpdateMasterAsync_ShouldReturnTrue_WhenUpdateSuccessful()
        {
            // Arrange
            var master = new MasterRecord { MasterId = 1 };
            _repositoryMock.Setup(x => x.MasterRepository.UpdateAsync(Database.NonScalling, master, false))
                .ReturnsAsync(1);

            // Act
            var result = await _service.UpdateMasterAsync(master);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task UpdateMasterAsync_ShouldReturnFalse_WhenUpdateFails()
        {
            // Arrange
            var master = new MasterRecord { MasterId = 1 };
            _repositoryMock.Setup(x => x.MasterRepository.UpdateAsync(Database.NonScalling, master, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.UpdateMasterAsync(master);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task DeleteMasterAsync_ShouldReturnTrue_WhenDeleteSuccessful()
        {
            // Arrange
            var master = new MasterRecord { MasterId = 1 };
            _repositoryMock.Setup(x => x.MasterRepository.DeleteAsync(Database.NonScalling, master, false))
                .ReturnsAsync(1);

            // Act
            var result = await _service.DeleteMasterAsync(master);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task DeleteMasterAsync_ShouldReturnFalse_WhenDeleteFails()
        {
            // Arrange
            var master = new MasterRecord { MasterId = 1 };
            _repositoryMock.Setup(x => x.MasterRepository.DeleteAsync(Database.NonScalling, master, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.DeleteMasterAsync(master);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task BulkCreateMasterAsync_ShouldReturnCreatedMasters()
        {
            // Arrange
            var masters = new List<MasterRecord>
            {
                new MasterRecord { MasterId = 1 },
                new MasterRecord { MasterId = 2 }
            };
            _repositoryMock.Setup(x => x.MasterRepository.BulkInsertAsync(Database.NonScalling, masters, false))
                .ReturnsAsync(masters);

            // Act
            var result = await _service.BulkCreateMasterAsync(masters);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(masters.Count, result.Count);
        }

        [Fact]
        public async Task BulkUpdateMasterAsync_ShouldReturnTrue_WhenUpdateSuccessful()
        {
            // Arrange
            var masters = new List<MasterRecord>
            {
                new MasterRecord { MasterId = 1 },
                new MasterRecord { MasterId = 2 }
            };
            _repositoryMock.Setup(x => x.MasterRepository.BulkUpdateAsync(Database.NonScalling, masters, false))
                .ReturnsAsync(2);

            // Act
            var result = await _service.BulkUpdateMasterAsync(masters);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task BulkUpdateMasterAsync_ShouldReturnFalse_WhenUpdateFails()
        {
            // Arrange
            var masters = new List<MasterRecord>
            {
                new MasterRecord { MasterId = 1 },
                new MasterRecord { MasterId = 2 }
            };
            _repositoryMock.Setup(x => x.MasterRepository.BulkUpdateAsync(Database.NonScalling, masters, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.BulkUpdateMasterAsync(masters);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task BulkDeleteMasterAsync_ShouldReturnTrue_WhenDeleteSuccessful()
        {
            // Arrange
            var masters = new List<MasterRecord>
            {
                new MasterRecord { MasterId = 1 },
                new MasterRecord { MasterId = 2 }
            };
            _repositoryMock.Setup(x => x.MasterRepository.BulkDeleteAsync(Database.NonScalling, masters, false))
                .ReturnsAsync(2);

            // Act
            var result = await _service.BulkDeleteMasterAsync(masters);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task BulkDeleteMasterAsync_ShouldReturnFalse_WhenDeleteFails()
        {
            // Arrange
            var masters = new List<MasterRecord>
            {
                new MasterRecord { MasterId = 1 },
                new MasterRecord { MasterId = 2 }
            };
            _repositoryMock.Setup(x => x.MasterRepository.BulkDeleteAsync(Database.NonScalling, masters, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.BulkDeleteMasterAsync(masters);

            // Assert
            Assert.False(result);
        }
    }
}

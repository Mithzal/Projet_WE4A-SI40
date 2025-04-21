<?php

namespace App\Entity;

use App\Repository\MembresUEsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MembresUEsRepository::class)]
class MembresUEs
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * @var Collection<int, Utilisateurs>
     */
    #[ORM\ManyToMany(targetEntity: Utilisateurs::class)]
    private Collection $user_id;

    /**
     * @var Collection<int, UEs>
     */
    #[ORM\ManyToMany(targetEntity: UEs::class)]
    private Collection $ue_id;

    #[ORM\Column(length: 10)]
    private ?string $Role_uv = null;

    public function __construct()
    {
        $this->user_id = new ArrayCollection();
        $this->ue_id = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, Utilisateurs>
     */
    public function getUserId(): Collection
    {
        return $this->user_id;
    }

    public function addUserId(Utilisateurs $userId): static
    {
        if (!$this->user_id->contains($userId)) {
            $this->user_id->add($userId);
        }

        return $this;
    }

    public function removeUserId(Utilisateurs $userId): static
    {
        $this->user_id->removeElement($userId);

        return $this;
    }

    /**
     * @return Collection<int, UEs>
     */
    public function getUeId(): Collection
    {
        return $this->ue_id;
    }

    public function addUeId(UEs $ueId): static
    {
        if (!$this->ue_id->contains($ueId)) {
            $this->ue_id->add($ueId);
        }

        return $this;
    }

    public function removeUeId(UEs $ueId): static
    {
        $this->ue_id->removeElement($ueId);

        return $this;
    }

    public function getRoleUv(): ?string
    {
        return $this->Role_uv;
    }

    public function setRoleUv(string $Role_uv): static
    {
        $this->Role_uv = $Role_uv;

        return $this;
    }
}
